import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      nombre,
      numero_telefono,
      img,
      pais_apertura,
      segmentos_id
    } = await readBody(event)

    if (
      id === undefined ||
      nombre === undefined ||
      numero_telefono === undefined ||
      img === undefined ||
      pais_apertura === undefined ||
      segmentos_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    // Primero obtener la imagen anterior antes de actualizar
    const oldResult = await pool.query('SELECT img FROM paises_operativos WHERE id = $1', [id])
    const oldPais = oldResult.rows[0]
    
    if (!oldPais) {
      return { success: false, message: 'País no encontrado' }
    }

    const query = `
      UPDATE paises_operativos SET
        nombre = $1,
        numero_telefono = $2,
        img = $3,
        pais_apertura = $4,
        segmentos_id = $5
      WHERE id = $6
      RETURNING *;
    `;

    const values = [
      nombre,
      numero_telefono,
      img,
      pais_apertura,
      segmentos_id,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el país para modificar' }
    }

    // Eliminar la imagen anterior de S3 si es diferente a la nueva
    if (oldPais.img && oldPais.img !== img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: oldPais.img }
        }) as { success: boolean }
        
        if (deleteResponse.success) {
          console.log('Imagen anterior eliminada de S3:', oldPais.img)
        } else {
          console.warn('No se pudo eliminar la imagen anterior de S3:', oldPais.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen anterior de S3:', error)
      }
    }

    return { success: true, message: 'País modificado correctamente', pais: result.rows[0] }
  } catch (error) {
    console.error('Error modificando país:', error)
    return { success: false, message: 'Error modificando país' }
  }
})
