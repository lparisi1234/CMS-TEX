import getDbPool from "../../db"
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    await pool.query('DELETE FROM itinerario WHERE id = $1', [id])
    
    return { success: true, message: 'Itinerario eliminado correctamente' }
  } catch (error) {
    console.error('Error eliminando itinerario:', error)
    return { success: false, message: 'Error eliminando itinerario' }
  }
})