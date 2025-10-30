import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
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

    // Iniciar transacción
    await pool.query('BEGIN')

    try {
      // Insertar operador
      const query = `
        INSERT INTO operador (
          nombre,
          estado,
          certificado,
          codigo,
          nro_orden,
          img,
          txt_contacto,
          txt_cancelaciones,
          nomenclatura
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
        nomenclatura
      ];

      const result = await pool.query(query, values)
      const operadorCreado = result.rows[0]

      // Insertar segmentos excluidos si existen
      if (segmentos_id && Array.isArray(segmentos_id) && segmentos_id.length > 0) {
        const segmentosQuery = `
          INSERT INTO operadores_segmentos (operador_id, segmento_id)
          VALUES ($1, $2)
        `;

        for (const segmentoId of segmentos_id) {
          await pool.query(segmentosQuery, [operadorCreado.id, segmentoId])
        }
      }

      // Confirmar transacción
      await pool.query('COMMIT')

      return { 
        success: true, 
        message: 'Operador creado correctamente', 
        operador: operadorCreado 
      }
    } catch (error) {
      // Revertir transacción en caso de error
      await pool.query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('Error creando Operador:', error)
    return { success: false, message: 'Error creando Operador' }
  }
})
