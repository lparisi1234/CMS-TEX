import { pool } from '../../db'

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }
    await pool.query('DELETE FROM "Categoria" WHERE id = $1', [id])
    return { success: true, message: 'Categoría eliminada correctamente' }
  } catch (error) {
    console.error('Error eliminando categoría:', error)
    return { success: false, message: 'Error eliminando categoría' }
  }
})
