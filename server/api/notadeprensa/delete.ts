import { pool } from '../../db'

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }
    await pool.query('DELETE FROM "NotaDePrensa" WHERE id = $1', [id])
    return { success: true, message: 'Nota De Prensa eliminado correctamente' }
  } catch (error) {
    console.error('Error eliminando Nota de Prensa:', error)
    return { success: false, message: 'Error eliminando Nota de Prensa' }
  }
})