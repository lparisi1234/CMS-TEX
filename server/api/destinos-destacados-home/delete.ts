import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    const result = await pool.query('SELECT img FROM destino_home WHERE id = $1', [id])
    const destinoHome = result.rows[0]
    
    if (!destinoHome) {
      return { success: false, message: 'Destino destacado no encontrado' }
    }

    await pool.query('DELETE FROM destino_home WHERE id = $1', [id])

    if (destinoHome.img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: destinoHome.img }
        }) as { success: boolean }
        
        if (!deleteResponse.success) {
          console.warn('No se pudo eliminar la imagen de S3:', destinoHome.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen de S3:', error)
      }
    }

    return { success: true, message: 'Destino destacado eliminado correctamente' }
  } catch (error) {
    console.error('Error eliminando destino destacado:', error)
    return { success: false, message: 'Error eliminando destino destacado' }
  }
})
