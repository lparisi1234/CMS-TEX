import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    const result = await pool.query('SELECT img FROM ciudades WHERE id = $1', [id])
    const ciudad = result.rows[0]
    
    if (!ciudad) {
      return { success: false, message: 'Ciudad no encontrada' }
    }

    await pool.query('DELETE FROM ciudades WHERE id = $1', [id])

    if (ciudad.imagen) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: ciudad.imagen }
        }) as { success: boolean }
        
        if (!deleteResponse.success) {
          console.warn('No se pudo eliminar la imagen de S3:', ciudad.imagen)
        }
      } catch (error) {
        console.warn('Error eliminando imagen de S3:', error)
      }
    }

    return { success: true, message: 'Ciudad eliminada correctamente' }
  } catch (error) {
    console.error('Error eliminando ciudad:', error)
    return { success: false, message: 'Error eliminando ciudad' }
  }
})
