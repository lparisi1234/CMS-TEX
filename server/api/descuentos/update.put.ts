import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      nombre,
      img,
      estado,
      codigo_newton,
    } = await readBody(event)

    if (
      id === undefined ||
      nombre === undefined ||
      img === undefined ||
      estado === undefined ||
      codigo_newton === undefined 
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const oldResult = await pool.query('SELECT img FROM descuentos WHERE id = $1', [id])
    const oldDescuento = oldResult.rows[0]
    
    if (!oldDescuento) {
      return { success: false, message: 'Descuento no encontrado' }
    }

    const query = `
      UPDATE descuentos SET
        nombre = $1,
        img = $2,
        estado = $3,
        codigo_newton = $4
      WHERE id = $5
      RETURNING *;
    `;

    const values = [
      nombre,
      img,
      estado,
      codigo_newton,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró Descuentos para modificar' }
    }

    if (oldDescuento.img && oldDescuento.img !== img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: oldDescuento.img }
        }) as { success: boolean }
        
        if (!deleteResponse.success) {
          console.warn('No se pudo eliminar la imagen anterior de S3:', oldDescuento.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen anterior de S3:', error)
      }
    }

    return { success: true, message: 'Descuento modificado correctamente', descuento: result.rows[0] }
  } catch (error) {
    console.error('Error modificando Descuentos:', error)
    return { success: false, message: 'Error modificando Descuentos' }
  }
})
