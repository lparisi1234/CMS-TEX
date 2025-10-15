import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    const result = await pool.query('SELECT img_carousel, img_search FROM categorias WHERE id = $1', [id])
    const categoria = result.rows[0]

    if (!categoria) {
      return { success: false, message: 'Categoría no encontrada' }
    }

    await pool.query('DELETE FROM categorias WHERE id = $1', [id])

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
      deleteImageFromS3(categoria.img_carousel),
      deleteImageFromS3(categoria.img_search)
    ])

    return { success: true, message: 'Categoría eliminada correctamente' }
  } catch (error) {
    console.error('Error eliminando categoría:', error)
    return { success: false, message: 'Error eliminando categoría' }
  }
})
