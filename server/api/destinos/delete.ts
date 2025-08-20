import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }
    await pool.query('DELETE FROM "Destinos" WHERE id = $1', [id])
    return { success: true, message: 'Destino eliminado correctamente' }
  } catch (error) {
    console.error('Error eliminando destino:', error)
    return { success: false, message: 'Error eliminando destino' }
  }
})
