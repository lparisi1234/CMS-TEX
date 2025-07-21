import { pool } from '../../db'

export default defineEventHandler(async (event) => {
  try {
    const {
      id,
      descripcion,
      txt_header,
      txt_footer,
      vencimiento_header,
      estado,
      codigo_newton,
      monedaId,
    } = await readBody(event)

    if (
      id === undefined ||
      descripcion === undefined ||
      txt_header === undefined ||
      txt_footer === undefined ||
      vencimiento_header === undefined ||
      estado === undefined ||
      codigo_newton === undefined ||
      monedaId === undefined 
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      UPDATE "Segmento" SET
        descripcion = $1,
        txt_header = $2,
        txt_footer = $3,
        vencimiento_header = $4,
        estado = $5,
        codigo_newton = $6,
        "monedaId" = $7
      WHERE id = $8
      RETURNING *;
    `;

    const values = [
      descripcion,
      txt_header,
      txt_footer,
      vencimiento_header,
      estado,
      codigo_newton,
      monedaId,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el segmento para modificar' }
    }
    return { success: true, message: 'Segmento modificado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error modificando segmento:', error)
    return { success: false, message: 'Error modificando segmento' }
  }
})
