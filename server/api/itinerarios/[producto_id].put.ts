import getDbPool from "../../db"
import { defineEventHandler, readBody, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const producto_id = getRouterParam(event, 'producto_id')
    const { itinerarios } = await readBody(event)
    const pool = await getDbPool()

    try {
      await pool.query('BEGIN')

      // Primero obtenemos los IDs de los itinerarios actuales
      const { rows: currentItinerarios } = await pool.query(
        'SELECT id FROM itinerario WHERE producto_id = $1',
        [producto_id]
      )

      // Eliminamos primero los destacados asociados a estos itinerarios
      if (currentItinerarios.length > 0) {
        const itinerarioIds = currentItinerarios.map(it => it.id)
        await pool.query(
          'DELETE FROM destacados WHERE itinerario_id = ANY($1)',
          [itinerarioIds]
        )
      }

      // Ahora sí podemos eliminar los itinerarios
      await pool.query('DELETE FROM itinerario WHERE producto_id = $1', [producto_id])

      // Insertamos los nuevos itinerarios y guardamos sus IDs
      const insertedItinerarios = []
      for (const itinerario of itinerarios) {
        const result = await pool.query(
          'INSERT INTO itinerario (producto_id, nro_dia, titulo, texto) VALUES ($1, $2, $3, $4) RETURNING id',
          [producto_id, itinerario.nro_dia, itinerario.titulo || '', itinerario.texto || '']
        )
        insertedItinerarios.push({
          ...itinerario,
          id: result.rows[0].id
        })
      }

      await pool.query('COMMIT')
      return { 
        success: true,
        itinerarios: insertedItinerarios
      }
    } catch (error) {
      await pool.query('ROLLBACK')
      throw error
    } finally {
      pool.release()
    }
  } catch (error) {
    console.error('Error updating itinerarios:', error)
    return { 
      success: false, 
      message: error.message || 'Error al actualizar los itinerarios' 
    }
  }
})