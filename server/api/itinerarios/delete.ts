import getDbPool from "../../db"
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)

    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      const { rows: [itinerario] } = await client.query(
        'SELECT producto_id, nro_dia FROM itinerario WHERE id = $1',
        [id]
      )

      if (!itinerario) {
        return { success: false, message: 'Itinerario no encontrado' }
      }

      await client.query('DELETE FROM itinerario WHERE id = $1', [id])
      await client.query(
        `UPDATE itinerario 
         SET nro_dia = nro_dia - 1 
         WHERE producto_id = $1 
         AND nro_dia > $2`,
        [itinerario.producto_id, itinerario.nro_dia]
      )

      await client.query('COMMIT')
      return { success: true, message: 'Itinerario eliminado correctamente' }
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error en la transacción:', error)
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error eliminando itinerario:', error)
    return { success: false, message: 'Error eliminando itinerario' }
  }
})