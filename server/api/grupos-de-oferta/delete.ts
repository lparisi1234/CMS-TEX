import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }
    await pool.query('DELETE FROM "GrupoDeOferta" WHERE id = $1', [id])
    return { success: true, message: 'Grupo de oferta eliminado correctamente' }
  } catch (error) {
    console.error('Error eliminando grupo de oferta:', error)
    return { success: false, message: 'Error eliminando grupo de oferta' }
  }
})
