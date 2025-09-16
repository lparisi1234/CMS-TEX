import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    // Primero obtener la imagen antes de eliminar el registro
    const result = await pool.query('SELECT img FROM expertos WHERE id = $1', [id])
    const experto = result.rows[0]
    
    if (!experto) {
      return { success: false, message: 'Experto no encontrado' }
    }

    // Eliminar el registro de la base de datos
    await pool.query('DELETE FROM expertos WHERE id = $1', [id])

    // Eliminar la imagen de S3 si existe
    if (experto.img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: experto.img }
        }) as { success: boolean }
        
        if (deleteResponse.success) {
          console.log('Imagen eliminada de S3:', experto.img)
        } else {
          console.warn('No se pudo eliminar la imagen de S3:', experto.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen de S3:', error)
      }
    }

    return { success: true, message: 'Experto eliminado correctamente' }
  } catch (error) {
    console.error('Error eliminando experto:', error)
    return { success: false, message: 'Error eliminando experto' }
  }
})
