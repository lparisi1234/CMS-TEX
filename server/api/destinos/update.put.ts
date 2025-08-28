import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
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
    } = await readBody(event)

    if (id === undefined) {
      return { success: false, message: 'ID es requerido para actualizar' }
    }

    const query = `
      UPDATE "Destinos" SET
        url = $1,
        cod_newton =$2,
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

    // Iniciar transacción
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      // 1. Actualizar el destino
      const result = await client.query(query, values)
      if (result.rows.length === 0) {
        await client.query('ROLLBACK')
        return { success: false, message: 'No se encontró el destino para modificar' }
      }
      
      const destinoActualizado = result.rows[0]
      
      
      await client.query('COMMIT')
      return { success: true, message: 'Destino modificado correctamente', destino: destinoActualizado }
      
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
