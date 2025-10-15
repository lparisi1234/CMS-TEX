import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    const result = await pool.query('SELECT img_desktop, img_tablet, img_mobile FROM grupos_de_ofertas WHERE id = $1', [id])
    const grupoOferta = result.rows[0]
    
    if (!grupoOferta) {
      return { success: false, message: 'Grupo de oferta no encontrado' }
    }

    await pool.query('DELETE FROM grupos_de_ofertas WHERE id = $1', [id])

    const deleteImageFromS3 = async (imageUrl: string) => {
      if (!imageUrl) return
      
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl }
        }) as { success: boolean }
        
        if (!deleteResponse.success) {
          console.warn('No se pudo eliminar la imagen de S3:', imageUrl)
        }
      } catch (error) {
        console.warn('Error eliminando imagen de S3:', error)
      }
    }

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
