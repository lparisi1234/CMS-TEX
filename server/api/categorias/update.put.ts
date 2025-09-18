import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      nombre,
      coordenadas_icono,
      coordenadas_icono_hover,
      icono_search,
      etiqueta_search,
      h2,
      h1,
      meta_titulo,
      meta_descripcion,
      meta_keywords,
      icono,
      nro_orden,
      img_carousel,
      img_search,
      video_mobile,
      video_desktop,
      estado,
      codigo_newton,
      experto_id,
      consejo_experto,
      url,
      subgrupos
    } = await readBody(event)

    if (
      id === undefined ||
      nombre === undefined ||
      coordenadas_icono === undefined ||
      coordenadas_icono_hover === undefined ||
      icono_search === undefined ||
      etiqueta_search === undefined ||
      h2 === undefined ||
      h1 === undefined ||
      meta_titulo === undefined ||
      meta_descripcion === undefined ||
      meta_keywords === undefined ||
      icono === undefined ||
      nro_orden === undefined ||
      img_carousel === undefined ||
      img_search === undefined ||
      video_mobile === undefined ||
      video_desktop === undefined ||
      estado === undefined ||
      codigo_newton === undefined ||
      experto_id === undefined ||
      consejo_experto === undefined ||
      url === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    // Primero obtener las imágenes anteriores antes de la transacción
    const oldResult = await pool.query('SELECT img_carousel, img_search FROM categorias WHERE id = $1', [id])
    const oldCategoria = oldResult.rows[0]
    
    if (!oldCategoria) {
      return { success: false, message: 'Categoría no encontrada' }
    }

    const query = `
      UPDATE categorias SET
        nombre = $1,
        coordenadas_icono = $2,
        coordenadas_icono_hover = $3,
        icono_search = $4,
        etiqueta_search = $5,
        h2 = $6,
        h1 = $7,
        meta_titulo = $8,
        meta_descripcion = $9,
        meta_keywords = $10,
        icono = $11,
        nro_orden = $12,
        img_carousel = $13,
        img_search = $14,
        video_mobile = $15,
        video_desktop = $16,
        estado = $17,
        codigo_newton = $18,
        experto_id = $19,
        consejo_experto = $20,
        url = $21
      WHERE id = $22
      RETURNING *;
    `

    const values = [
      nombre,
      coordenadas_icono,
      coordenadas_icono_hover,
      icono_search,
      etiqueta_search,
      h2,
      h1,
      meta_titulo,
      meta_descripcion,
      meta_keywords,
      icono,
      nro_orden,
      img_carousel,
      img_search,
      video_mobile,
      video_desktop,
      estado,
      codigo_newton,
      experto_id,
      consejo_experto,
      url,
      id
    ]

    // Iniciar transacción
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      // 1. Actualizar la categoría
      const result = await client.query(query, values)
      if (result.rows.length === 0) {
        await client.query('ROLLBACK')
        return { success: false, message: 'No se encontró la categoría para modificar' }
      }
      
      const categoriaActualizada = result.rows[0]
      
      // 2. Si hay subgrupos y son nuevos (IDs temporales), crearlos
      if (subgrupos && Array.isArray(subgrupos) && subgrupos.length > 0) {
        for (const subgrupo of subgrupos) {
          // Solo crear subgrupos con IDs temporales (muy altos)
          if (subgrupo.id && subgrupo.id > Date.now() - 10000000) {
            const createSubgrupoQuery = `
              INSERT INTO subgrupos_cat (
                nombre,
                categoria_id,
                nro_orden
              ) VALUES (
                $1, $2, $3
              ) RETURNING *;
            `
            
            const subgrupoValues = [
              subgrupo.nombre,
              categoriaActualizada.id,
              subgrupo.nro_orden
            ]
            
            const subgrupoResult = await client.query(createSubgrupoQuery, subgrupoValues)
            const subgrupoCreado = subgrupoResult.rows[0]
            
            // 3. Si el subgrupo tiene productos_ids, crear las relaciones
            if (subgrupo.productos_ids && Array.isArray(subgrupo.productos_ids) && subgrupo.productos_ids.length > 0) {
              for (const producto_id of subgrupo.productos_ids) {
                await client.query(`
                  INSERT INTO subgrupos_prod (
                    producto_id,
                    subgrupo_cat_id,
                    subgrupo_dst_id
                  ) VALUES (
                    $1, $2, $3
                  );
                `, [producto_id, subgrupoCreado.id, null])
              }
            }
          }
        }
      }
      
      await client.query('COMMIT')

      // Función auxiliar para eliminar imagen de S3
      const deleteImageFromS3 = async (imageUrl: string) => {
        if (!imageUrl) return
        
        try {
          const deleteResponse = await $fetch('/api/delete-image', {
            method: 'POST',
            body: { imageUrl }
          }) as { success: boolean }
          
          if (deleteResponse.success) {
            console.log('Imagen anterior eliminada de S3:', imageUrl)
          } else {
            console.warn('No se pudo eliminar la imagen anterior de S3:', imageUrl)
          }
        } catch (error) {
          console.warn('Error eliminando imagen anterior de S3:', error)
        }
      }

      // Eliminar las imágenes anteriores de S3 si son diferentes a las nuevas (después de la transacción)
      await Promise.all([
        oldCategoria.img_carousel !== img_carousel ? deleteImageFromS3(oldCategoria.img_carousel) : Promise.resolve(),
        oldCategoria.img_search !== img_search ? deleteImageFromS3(oldCategoria.img_search) : Promise.resolve()
      ])

      return { success: true, message: 'Categoría modificada correctamente', categoria: categoriaActualizada }
      
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error modificando categoría:', error)
    return { success: false, message: 'Error modificando categoría' }
  }
})
