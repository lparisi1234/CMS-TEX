import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      img,
      nombre
    } = await readBody(event)

    if (
      id === undefined ||
      img === undefined ||
      nombre === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    // Primero obtener la imagen anterior antes de actualizar
    const oldResult = await pool.query('SELECT img FROM expertos WHERE id = $1', [id])
    const oldExperto = oldResult.rows[0]
    
    if (!oldExperto) {
      return { success: false, message: 'Experto no encontrado' }
    }

    const query = `
      UPDATE expertos SET
        img = $1,
        nombre = $2
      WHERE id = $3
      RETURNING *;
    `;

    const values = [
      img,
      nombre,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el experto para modificar' }
    }

    // Eliminar la imagen anterior de S3 si es diferente a la nueva
    if (oldExperto.img && oldExperto.img !== img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: oldExperto.img }
        }) as { success: boolean }
        
        if (deleteResponse.success) {
          console.log('Imagen anterior eliminada de S3:', oldExperto.img)
        } else {
          console.warn('No se pudo eliminar la imagen anterior de S3:', oldExperto.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen anterior de S3:', error)
      }
    }

    return { success: true, message: 'Experto modificado correctamente', experto: result.rows[0] }
  } catch (error) {
    console.error('Error modificando experto:', error)
    return { success: false, message: 'Error modificando experto' }
  }
})
