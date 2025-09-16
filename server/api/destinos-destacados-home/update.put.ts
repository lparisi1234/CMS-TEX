import getDbPool from "../../db"

export default defineEventHandler(async (event) => {

  const pool = await getDbPool()
  const client = await pool.connect()

  try {
    const {
      id,
      destino_id,
      segmentos_id,
      nro_orden,
      precio_desde,
      img
    } = await readBody(event)

    if (
      id === undefined ||
      destino_id === undefined ||
      segmentos_id === undefined ||
      nro_orden === undefined ||
      precio_desde === undefined ||
      img === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    // Primero obtener la imagen anterior antes de la transacción
    const oldResult = await pool.query('SELECT img FROM destino_home WHERE id = $1', [id])
    const oldDestinoHome = oldResult.rows[0]
    
    if (!oldDestinoHome) {
      return { success: false, message: 'Destino destacado no encontrado' }
    }

    await client.query('BEGIN');

    const queryDestinoHome = `
      UPDATE destino_home SET
                destino_id = $1,
                nro_orden = $2,
                precio_desde = $3,
                img = $4
            WHERE id = $5
            RETURNING *;
    `;

    const resultadoDestinoHome = await client.query(queryDestinoHome, [
      destino_id,
      nro_orden,
      precio_desde,
      img,
      id
    ]);

    if (resultadoDestinoHome.rows.length === 0) {
      await client.query('ROLLBACK');
      return { success: false, message: 'El registro no se encontró.' };
    }

     const queryDeleteSegmentos = `
      DELETE FROM destino_home_segmentos
      WHERE destino_home_id = $1;
    `;
    await client.query(queryDeleteSegmentos, [id]);

    if (segmentos_id && Array.isArray(segmentos_id) && segmentos_id.length > 0) {
      const queryInsertSegmentos = `
        INSERT INTO destino_home_segmentos (destino_home_id, segmento_id) VALUES ($1, $2);
      `;
      for (const segmentoId of segmentos_id) {
        await client.query(queryInsertSegmentos, [id, parseInt(segmentoId)]);
      }
    }

    await client.query('COMMIT');

    // Eliminar la imagen anterior de S3 si es diferente a la nueva (después de la transacción)
    if (oldDestinoHome.img && oldDestinoHome.img !== img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: oldDestinoHome.img }
        }) as { success: boolean }
        
        if (deleteResponse.success) {
          console.log('Imagen anterior eliminada de S3:', oldDestinoHome.img)
        } else {
          console.warn('No se pudo eliminar la imagen anterior de S3:', oldDestinoHome.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen anterior de S3:', error)
      }
    }

    return {
      success: true,
      message: 'Destino Home Destacado correctamente.',
      destino: { ...resultadoDestinoHome.rows[0], segmentos_id }
    };
  } catch (error) {
    await client.query('ROLLBACK'); // Deshacer los cambios en caso de error
    console.error('Error actualizando Destino Home Destacado:', error);
    return { success: false, message: 'Error actualizando Destino Home Destacado.' };
  } finally {
    client.release();
  }
})
