import getDbPool from "../../db"
import { defineEventHandler, readBody, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const producto_id = getRouterParam(event, 'producto_id')
    const { itinerarios } = await readBody(event)
    const pool = await getDbPool()
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Eliminamos todos los itinerarios existentes del producto
      await client.query('DELETE FROM itinerario WHERE producto_id = $1', [producto_id])

      // Insertamos los nuevos itinerarios
      for (const itinerario of itinerarios) {
        await client.query(
          'INSERT INTO itinerario (producto_id, nro_dia, titulo, texto) VALUES ($1, $2, $3, $4)',
          [producto_id, itinerario.nro_dia, itinerario.titulo || '', itinerario.texto || '']
        )
      }

      await client.query('COMMIT')
      return { success: true }
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error updating itinerarios:', error)
    return { 
      success: false, 
      message: error.message || 'Error al actualizar los itinerarios' 
    }
  }
})