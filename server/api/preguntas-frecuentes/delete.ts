import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }
    await pool.query('DELETE FROM preguntas_frecuentes WHERE id = $1', [id])
    return { success: true, message: 'Pregunta frecuente eliminada correctamente' }
  } catch (error) {
    console.error('Error eliminando pregunta frecuente:', error)
    return { success: false, message: 'Error eliminando pregunta frecuente' }
  }
})
