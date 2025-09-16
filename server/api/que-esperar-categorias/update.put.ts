import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      categoria_id,
      titulo,
      descripcion,
      img,
      region_id,
      nro_orden
    } = await readBody(event)

    if (
      id === undefined ||
      categoria_id === undefined ||
      titulo === undefined ||
      descripcion === undefined ||
      nro_orden === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    // Primero obtener la imagen anterior antes de actualizar
    const oldResult = await pool.query('SELECT img FROM que_esperar WHERE id = $1', [id])
    const oldQueEsperar = oldResult.rows[0]
    
    if (!oldQueEsperar) {
      return { success: false, message: 'Que esperar no encontrado' }
    }

    const query = `
      UPDATE que_esperar SET
        categoria_id = $1,
        region_id = COALESCE($2, region_id),
        titulo = $3,
        descripcion = $4,
        img = COALESCE($5, img),
        nro_orden = $6
      WHERE id = $7
      RETURNING *;
    `;

    const values = [
      categoria_id,
      region_id ?? null,
      titulo,
      descripcion,
      img ?? null,
      nro_orden,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el que esperar para modificar' }
    }

    // Eliminar la imagen anterior de S3 si es diferente a la nueva
    if (oldQueEsperar.img && oldQueEsperar.img !== img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: oldQueEsperar.img }
        }) as { success: boolean }
        
        if (deleteResponse.success) {
          console.log('Imagen anterior eliminada de S3:', oldQueEsperar.img)
        } else {
          console.warn('No se pudo eliminar la imagen anterior de S3:', oldQueEsperar.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen anterior de S3:', error)
      }
    }

    return { success: true, message: 'Que esperar modificado correctamente', queEsperar: result.rows[0] }
  } catch (error) {
    console.error('Error modificando que esperar:', error)
    return { success: false, message: 'Error modificando que esperar' }
  }
})
