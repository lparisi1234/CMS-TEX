import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }
    await pool.query('DELETE FROM "Ciudades" WHERE id = $1', [id])
    return { success: true, message: 'Ciudad eliminada correctamente' }
  } catch (error) {
    console.error('Error eliminando ciudad:', error)
    return { success: false, message: 'Error eliminando ciudad' }
  }
})
