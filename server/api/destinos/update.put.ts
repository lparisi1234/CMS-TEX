import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const body = await readBody(event)
    const {
      id,
      cod_newton,
      url,
      nombre,
      h1,
      h2,
      video_mobile,
      video_desktop,
      experto_id,
      consejo_experto,
      img,
      meta_titulo,
      meta_descripcion,
      meta_keywords,
      mapa,
      estado,
      nro_orden,
      precio_desde,
      region_id,
      masVendidos,
      vueloIncluido,
      recomendados
    } = body

    if (id === undefined) {
      return { success: false, message: 'ID es requerido para actualizar' }
    }

    // Primero obtener la imagen anterior antes de la transacción
    const oldResult = await pool.query('SELECT img FROM destinos WHERE id = $1', [id])
    const oldDestino = oldResult.rows[0]
    
    if (!oldDestino) {
      return { success: false, message: 'Destino no encontrado' }
    }

    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      // 1. Actualizar datos principales del destino
      const query = `
        UPDATE destinos SET
          url = $1,
          cod_newton = $2,
          nombre = $3,
          h1 = $4,
          h2 = $5,
          video_mobile = $6,
          video_desktop = $7,
          experto_id = $8,
          consejo_experto = $9,
          img = $10,
          meta_titulo = $11,
          meta_descripcion = $12,
          meta_keywords = $13,
          mapa = $14,
          estado = $15,
          nro_orden = $16,
          precio_desde = $17,
          region_id = $18
        WHERE id = $19
        RETURNING *;
      `

      const values = [
        url,
        cod_newton,
        nombre,
        h1,
        h2,
        video_mobile,
        video_desktop,
        experto_id,
        consejo_experto,
        img,
        meta_titulo,
        meta_descripcion,
        meta_keywords,
        mapa,
        estado,
        nro_orden,
        precio_desde,
        region_id,
        id
      ]

      const result = await client.query(query, values)

      // 2. Función para actualizar las tablas relacionadas
      const updateRelatedProducts = async (tableName: string, products: string[]) => {
        // Primero eliminamos todas las relaciones existentes
        await client.query(`
          DELETE FROM ${tableName}
          WHERE destino_id = $1
        `, [id])

        // Si hay productos nuevos, los insertamos
        if (Array.isArray(products) && products.length > 0) {
          const insertValues = products.map((productoId, index) => {
            return `($1, $${index + 2})`
          }).join(', ')

          const insertQuery = `
            INSERT INTO ${tableName} (destino_id, producto_id)
            VALUES ${insertValues}
          `

          await client.query(insertQuery, [id, ...products])
        }
      }

      // 3. Actualizar cada tabla relacionada si los datos vienen en el body
      if (body.hasOwnProperty('masVendidos')) {
        await updateRelatedProducts('mas_vendidos_dst', masVendidos || [])
      }
      
      if (body.hasOwnProperty('vueloIncluido')) {
        await updateRelatedProducts('vuelos_incluidos_dst', vueloIncluido || [])
      }
      
      if (body.hasOwnProperty('recomendados')) {
        await updateRelatedProducts('recomendados_dst', recomendados || [])
      }

      await client.query('COMMIT')

      // Eliminar la imagen anterior de S3 si es diferente a la nueva (después de la transacción)
      if (oldDestino.img && oldDestino.img !== img) {
        try {
          const deleteResponse = await $fetch('/api/delete-image', {
            method: 'POST',
            body: { imageUrl: oldDestino.img }
          }) as { success: boolean }
          
          if (deleteResponse.success) {
            console.log('Imagen anterior eliminada de S3:', oldDestino.img)
          } else {
            console.warn('No se pudo eliminar la imagen anterior de S3:', oldDestino.img)
          }
        } catch (error) {
          console.warn('Error eliminando imagen anterior de S3:', error)
        }
      }

      return {
        success: true,
        message: 'Destino y productos relacionados actualizados correctamente',
        destino: result.rows[0]
      }
      
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error modificando destino:', error)
    return { success: false, message: 'Error modificando destino' }
  }
})
