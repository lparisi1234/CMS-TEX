import { pool } from '../../db'

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }
    await pool.query('DELETE FROM "Operador" WHERE id = $1', [id])
    return { success: true, message: 'Operador eliminado correctamente' }
  } catch (error) {
    console.error('Error eliminando Operador:', error)
    return { success: false, message: 'Error eliminando Operador' }
  }
})