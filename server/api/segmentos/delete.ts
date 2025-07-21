import { pool } from '../../db'

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }
    await pool.query('DELETE FROM "Segmento" WHERE id = $1', [id])
    return { success: true, message: 'Segmento eliminado correctamente' }
  } catch (error) {
    console.error('Error eliminando Segmento:', error)
    return { success: false, message: 'Error eliminando Segmento' }
  }
})