import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      descripcion,
      txt_header,
      txt_footer,
      vencimiento_header,
      estado,
      cod_newton,
      monedaId,
      url
    } = await readBody(event)

    if (
      id === undefined ||
      descripcion === undefined ||
      txt_header === undefined ||
      txt_footer === undefined ||
      vencimiento_header === undefined ||
      estado === undefined ||
      cod_newton === undefined ||
      monedaId === undefined 
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      UPDATE segmentos SET
        descripcion = $1,
        txt_header = $2,
        txt_footer = $3,
        vencimiento_header = $4,
        estado = $5,
        cod_newton = $6,
        "monedaId" = $7,
        url = $8
      WHERE id = $9
      RETURNING *;
    `;

    const values = [
      descripcion,
      txt_header,
      txt_footer,
      vencimiento_header,
      estado,
      cod_newton,
      monedaId,
      url,
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
