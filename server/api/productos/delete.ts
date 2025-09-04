import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    // Primero obtener las imágenes antes de eliminar el registro
    const result = await pool.query('SELECT img, imagen_mobile FROM "Producto" WHERE id = $1', [id])
    const producto = result.rows[0]
    
    if (!producto) {
      return { success: false, message: 'Producto no encontrado' }
    }

    // Eliminar el registro de la base de datos
    await pool.query('DELETE FROM "Producto" WHERE id = $1', [id])

    // Función auxiliar para eliminar imagen de S3
    const deleteImageFromS3 = async (imageUrl: string) => {
      if (!imageUrl) return
      
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl }
        }) as { success: boolean }
        
        if (deleteResponse.success) {
          console.log('Imagen eliminada de S3:', imageUrl)
        } else {
          console.warn('No se pudo eliminar la imagen de S3:', imageUrl)
        }
      } catch (error) {
        console.warn('Error eliminando imagen de S3:', error)
      }
    }

    // Eliminar las imágenes de S3 si existen
    await Promise.all([
      deleteImageFromS3(producto.img),
      deleteImageFromS3(producto.imagen_mobile)
    ])

    return { success: true, message: 'Producto eliminado correctamente' }
  } catch (error) {
    console.error('Error eliminando producto:', error)
    return { success: false, message: 'Error eliminando producto' }
  }
})
