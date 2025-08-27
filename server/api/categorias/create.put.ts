import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
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
      idExperto,
      consejo_experto,
      url,
      subgrupos
    } = await readBody(event)

    if (
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
      idExperto === undefined ||
      consejo_experto === undefined ||
      url === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO "Categoria" (
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
        "idExperto",
        consejo_experto,
        url
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
      ) RETURNING *;
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
      idExperto,
      consejo_experto,
      url
    ]

    // Iniciar transacción
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      // 1. Crear la categoría
      const result = await client.query(query, values)
      const categoriaCreada = result.rows[0]
      
      // 2. Si hay subgrupos, crearlos
      if (subgrupos && Array.isArray(subgrupos) && subgrupos.length > 0) {
        for (const subgrupo of subgrupos) {
          const createSubgrupoQuery = `
            INSERT INTO "Subgrupos_cat" (
              nombre,
              categoria_id,
              nro_orden
            ) VALUES (
              $1, $2, $3
            ) RETURNING *;
          `
          
          const subgrupoValues = [
            subgrupo.nombre,
            categoriaCreada.id,
            subgrupo.nro_orden
          ]
          
          const subgrupoResult = await client.query(createSubgrupoQuery, subgrupoValues)
          const subgrupoCreado = subgrupoResult.rows[0]
          
          // 3. Si el subgrupo tiene productos_ids, crear las relaciones
          if (subgrupo.productos_ids && Array.isArray(subgrupo.productos_ids) && subgrupo.productos_ids.length > 0) {
            for (const producto_id of subgrupo.productos_ids) {
              await client.query(`
                INSERT INTO "SubGrupo_prod" (
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
      
      await client.query('COMMIT')
      return { success: true, message: 'Categoría creada correctamente', categoria: categoriaCreada }
      
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error creando categoría:', error)
    return { success: false, message: 'Error creando categoría' }
  }
})
