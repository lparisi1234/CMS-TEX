import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    // Primero obtener la imagen antes de eliminar el registro
    const result = await pool.query('SELECT img FROM opinion WHERE id = $1', [id])
    const opinion = result.rows[0]
    
    if (!opinion) {
      return { success: false, message: 'Opinión no encontrada' }
    }

    // Eliminar el registro de la base de datos
    await pool.query('DELETE FROM opinion WHERE id = $1', [id])

    // Eliminar la imagen de S3 si existe
    if (opinion.img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: opinion.img }
        }) as { success: boolean }
        
        if (deleteResponse.success) {
          console.log('Imagen eliminada de S3:', opinion.img)
        } else {
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
