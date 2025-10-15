import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    const result = await pool.query('SELECT img FROM paises_operativos WHERE id = $1', [id])
    const pais = result.rows[0]
    
    if (!pais) {
      return { success: false, message: 'País no encontrado' }
    }

    await pool.query('DELETE FROM paises_operativos WHERE id = $1', [id])

    if (pais.img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: pais.img }
        }) as { success: boolean }
        
        if (!deleteResponse.success) {
          console.warn('No se pudo eliminar la imagen de S3:', pais.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen de S3:', error)
      }
    }

    return { success: true, message: 'País eliminado correctamente' }
  } catch (error) {
    console.error('Error eliminando país:', error)
    return { success: false, message: 'Error eliminando país' }
  }
})
