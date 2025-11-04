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
      nombre_alternativo,
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

    const oldResult = await pool.query('SELECT img FROM destinos WHERE id = $1', [id])
    const oldDestino = oldResult.rows[0]
    
    if (!oldDestino) {
      return { success: false, message: 'Destino no encontrado' }
    }

    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      const query = `
        UPDATE destinos SET
          url = $1,
          cod_newton = $2,
          nombre = $3,
          nombre_alternativo = $4,
          h1 = $5,
          h2 = $6,
          video_mobile = $7,
          video_desktop = $8,
          experto_id = $9,
          consejo_experto = $10,
          img = $11,
          meta_titulo = $12,
          meta_descripcion = $13,
          meta_keywords = $14,
          mapa = $15,
          estado = $16,
          nro_orden = $17,
          precio_desde = $18,
          region_id = $19
        WHERE id = $20
        RETURNING *;
      `

      const values = [
        url,
        cod_newton,
        nombre,
        nombre_alternativo,
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

      const updateRelatedProducts = async (tableName: string, products: string[]) => {
        await client.query(`
          DELETE FROM ${tableName}
          WHERE destino_id = $1
        `, [id])

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

      if (oldDestino.img && oldDestino.img !== img) {
        try {
          const deleteResponse = await $fetch('/api/delete-image', {
            method: 'POST',
            body: { imageUrl: oldDestino.img }
          }) as { success: boolean }
          
          if (!deleteResponse.success) {
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
