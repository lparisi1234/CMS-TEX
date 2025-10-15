import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    const result = await pool.query('SELECT img FROM opinion WHERE id = $1', [id])
    const opinion = result.rows[0]
    
    if (!opinion) {
      return { success: false, message: 'Opinión no encontrada' }
    }

    await pool.query('DELETE FROM opinion WHERE id = $1', [id])

    if (opinion.img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: opinion.img }
        }) as { success: boolean }
        
        if (!deleteResponse.success) {
          console.warn('No se pudo eliminar la imagen de S3:', opinion.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen de S3:', error)
      }
    }

    return { success: true, message: 'Opinión eliminada correctamente' }
  } catch (error) {
    console.error('Error eliminando opinión:', error)
    return { success: false, message: 'Error eliminando opinión' }
  }
})
