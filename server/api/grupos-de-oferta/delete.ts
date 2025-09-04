import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    // Primero obtener las imágenes antes de eliminar el registro
    const result = await pool.query('SELECT img_desktop, img_tablet, img_mobile FROM "GrupoDeOferta" WHERE id = $1', [id])
    const grupoOferta = result.rows[0]
    
    if (!grupoOferta) {
      return { success: false, message: 'Grupo de oferta no encontrado' }
    }

    // Eliminar el registro de la base de datos
    await pool.query('DELETE FROM "GrupoDeOferta" WHERE id = $1', [id])

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
      deleteImageFromS3(grupoOferta.img_desktop),
      deleteImageFromS3(grupoOferta.img_tablet),
      deleteImageFromS3(grupoOferta.img_mobile)
    ])

    return { success: true, message: 'Grupo de oferta eliminado correctamente' }
  } catch (error) {
    console.error('Error eliminando grupo de oferta:', error)
    return { success: false, message: 'Error eliminando grupo de oferta' }
  }
})
