import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    const result = await pool.query('SELECT img FROM que_esperar WHERE id = $1', [id])
    const queEsperar = result.rows[0]
    
    if (!queEsperar) {
      return { success: false, message: 'Que esperar no encontrado' }
    }

    await pool.query('DELETE FROM que_esperar WHERE id = $1', [id])

    if (queEsperar.img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: queEsperar.img }
        }) as { success: boolean }
        
        if (!deleteResponse.success) {
          console.warn('No se pudo eliminar la imagen de S3:', queEsperar.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen de S3:', error)
      }
    }

    return { success: true, message: 'Que esperar eliminado correctamente' }
  } catch (error) {
    console.error('Error eliminando que esperar:', error)
    return { success: false, message: 'Error eliminando que esperar' }
  }
})
