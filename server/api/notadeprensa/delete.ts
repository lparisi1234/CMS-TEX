import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    // Primero obtener la imagen antes de eliminar el registro
    const result = await pool.query('SELECT img FROM nota_prensa WHERE id = $1', [id])
    const notadeprensa = result.rows[0]
    
    if (!notadeprensa) {
      return { success: false, message: 'Nota de Prensa no encontrada' }
    }

    // Eliminar el registro de la base de datos
    await pool.query('DELETE FROM nota_prensa WHERE id = $1', [id])

    // Eliminar la imagen de S3 si existe
    if (notadeprensa.img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: notadeprensa.img }
        }) as { success: boolean }
        
        if (deleteResponse.success) {
          console.log('Imagen eliminada de S3:', notadeprensa.img)
        } else {
          console.warn('No se pudo eliminar la imagen de S3:', notadeprensa.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen de S3:', error)
      }
    }

    return { success: true, message: 'Nota De Prensa eliminada correctamente' }
  } catch (error) {
    console.error('Error eliminando Nota de Prensa:', error)
    return { success: false, message: 'Error eliminando Nota de Prensa' }
  }
})