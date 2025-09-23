import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      cod_newton,
      img,
      guia,
      nombre,
      estado,
      destino_id,
      iata
    } = await readBody(event)

    // if (
    //   id === undefined ||
    //   cod_newton === undefined ||
    //   imagen === undefined ||
    //   guia === undefined ||
    //   nombre === undefined ||
    //   estado === undefined ||
    //   destino_id === undefined
    // ) {
    //   return { success: false, message: 'Faltan campos requeridos' }
    // }

    // Primero obtener la imagen anterior antes de actualizar
    const oldResult = await pool.query('SELECT img FROM ciudades WHERE id = $1', [id])
    const oldCiudad = oldResult.rows[0]
    
    if (!oldCiudad) {
      return { success: false, message: 'Ciudad no encontrada' }
    }

    

    const query = `
      UPDATE ciudades SET
        cod_newton = $1,
        img = $2,
        guia = $3,
        nombre = $4,
        estado = $5,
        destino_id = $6,
        iata = $7
      WHERE id = $8
      RETURNING *;
    `;

    const values = [
      cod_newton,
      img,
      guia,
      nombre,
      estado,
      destino_id,
      iata,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró la ciudad para modificar' }
    }

    // Eliminar la imagen anterior de S3 si es diferente a la nueva
    if (oldCiudad.imagen && oldCiudad.imagen !== img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: oldCiudad.imagen }
        }) as { success: boolean }
        
        if (deleteResponse.success) {
          console.log('Imagen anterior eliminada de S3:', oldCiudad.imagen)
        } else {
          console.warn('No se pudo eliminar la imagen anterior de S3:', oldCiudad.imagen)
        }
      } catch (error) {
        console.warn('Error eliminando imagen anterior de S3:', error)
      }
    }

    return { success: true, message: 'Ciudad modificada correctamente', ciudad: result.rows[0] }
  } catch (error) {
    console.error('Error modificando ciudad:', error)
    return { success: false, message: 'Error modificando ciudad' }
  }
})
