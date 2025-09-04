import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
    try {
    const pool = await getDbPool()
    const {
      id,
      descripcion,
      img,
      url,
      estado
    } = await readBody(event)

    if (
      id === undefined ||
      descripcion === undefined ||
      img === undefined ||
      url === undefined ||
      estado === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    // Primero obtener la imagen anterior antes de actualizar
    const oldResult = await pool.query('SELECT img FROM "NotaDePrensa" WHERE id = $1', [id])
    const oldNotadeprensa = oldResult.rows[0]
    
    if (!oldNotadeprensa) {
      return { success: false, message: 'Nota de Prensa no encontrada' }
    }

    const query = `
       UPDATE "NotaDePrensa" SET
        descripcion = $1,
        img = $2,
        url = $3,
        estado = $4
      WHERE id = $5 
      RETURNING *;
    `;

    const values = [
     descripcion,
      img,
      url,
      estado,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró la Nota De Prensa para modificar' }
    }

    // Eliminar la imagen anterior de S3 si es diferente a la nueva
    if (oldNotadeprensa.img && oldNotadeprensa.img !== img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: oldNotadeprensa.img }
        }) as { success: boolean }
        
        if (deleteResponse.success) {
          console.log('Imagen anterior eliminada de S3:', oldNotadeprensa.img)
        } else {
          console.warn('No se pudo eliminar la imagen anterior de S3:', oldNotadeprensa.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen anterior de S3:', error)
      }
    }

    return { success: true, message: 'Nota de Prensa modificada correctamente', notadeprensa: result.rows[0] }
  } catch (error) {
    console.error('Error modificando Nota de Prensa:', error)
    return { success: false, message: 'Error modificando Nota de Prensa' }
  }
})