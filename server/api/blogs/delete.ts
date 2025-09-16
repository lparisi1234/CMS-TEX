import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    // Primero obtener la imagen antes de eliminar el registro
    const result = await pool.query('SELECT img FROM nota_blog WHERE id = $1', [id])
    const blog = result.rows[0]
    
    if (!blog) {
      return { success: false, message: 'Blog no encontrado' }
    }

    // Eliminar el registro de la base de datos
    await pool.query('DELETE FROM nota_blog WHERE id = $1', [id])

    // Eliminar la imagen de S3 si existe
    if (blog.img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: blog.img }
        }) as { success: boolean }
        
        if (deleteResponse.success) {
          console.log('Imagen eliminada de S3:', blog.img)
        } else {
          console.warn('No se pudo eliminar la imagen de S3:', blog.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen de S3:', error)
      }
    }

    return { success: true, message: 'Blog eliminado correctamente' }
  } catch (error) {
    console.error('Error eliminando blog:', error)
    return { success: false, message: 'Error eliminando blog' }
  }
})
