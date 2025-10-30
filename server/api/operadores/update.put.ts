import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      nombre,
      estado,
      certificado,
      codigo,
      nro_orden,
      img,
      txt_contacto,
      txt_cancelaciones,
      nomenclatura,
      segmentos_id // Cambiar de segmentos_excluidos a segmentos_id
    } = await readBody(event)

    if (
      id === undefined ||
      nombre === undefined ||
      estado === undefined ||
      certificado === undefined ||
      codigo === undefined ||
      nro_orden === undefined ||
      img === undefined ||
      txt_contacto === undefined ||
      txt_cancelaciones === undefined ||
      nomenclatura === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const oldResult = await pool.query('SELECT img FROM operador WHERE id = $1', [id])
    const oldOperador = oldResult.rows[0]

    if (!oldOperador) {
      return { success: false, message: 'Operador no encontrado' }
    }

    // Iniciar transacción
    await pool.query('BEGIN')

    try {
      // Actualizar operador
      const query = `
        UPDATE operador SET
          nombre = $1,
          estado = $2,
          certificado = $3,
          codigo = $4,
          nro_orden = $5,
          img = $6,
          txt_contacto = $7,
          txt_cancelaciones = $8,
          nomenclatura = $9
        WHERE id = $10
        RETURNING *;
      `;

      const values = [
        nombre,
        estado,
        certificado,
        codigo,
        nro_orden,
        img,
        txt_contacto,
        txt_cancelaciones,
        nomenclatura,
        id
      ];

      const result = await pool.query(query, values)
      if (result.rows.length === 0) {
        await pool.query('ROLLBACK')
        return { success: false, message: 'No se encontró el Operador para modificar' }
      }

      // Eliminar segmentos excluidos anteriores
      await pool.query('DELETE FROM operadores_segmentos WHERE operador_id = $1', [id])

      // Insertar nuevos segmentos excluidos si existen
      if (segmentos_id && Array.isArray(segmentos_id) && segmentos_id.length > 0) {
        const segmentosQuery = `
          INSERT INTO operadores_segmentos (operador_id, segmento_id)
          VALUES ($1, $2)
        `;

        for (const segmentoId of segmentos_id) {
          await pool.query(segmentosQuery, [id, segmentoId])
        }
      }

      // Confirmar transacción
      await pool.query('COMMIT')

      // Eliminar imagen anterior si cambió
      if (oldOperador.img && oldOperador.img !== img) {
        try {
          const deleteResponse = await $fetch('/api/delete-image', {
            method: 'POST',
            body: { imageUrl: oldOperador.img }
          }) as { success: boolean }

          if (!deleteResponse.success) {
            console.warn('No se pudo eliminar la imagen anterior de S3:', oldOperador.img)
          }
        } catch (error) {
          console.warn('Error eliminando imagen anterior de S3:', error)
        }
      }

      return { success: true, message: 'Operador modificado correctamente', operador: result.rows[0] }
    } catch (error) {
      // Revertir transacción en caso de error
      await pool.query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('Error modificando Operador:', error)
    return { success: false, message: 'Error modificando Operador' }
  }
})
