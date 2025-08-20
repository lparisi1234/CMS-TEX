import getDbPool from "~/server/db"

export default defineEventHandler(async (event) => {
  const pool = await getDbPool();
  try {
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }
    await pool.query('DELETE FROM "NotaBlog" WHERE id = $1', [id])
    return { success: true, message: 'Blog eliminado correctamente' }
  } catch (error) {
    console.error('Error eliminando blog:', error)
    return { success: false, message: 'Error eliminando blog' }
  }
})
