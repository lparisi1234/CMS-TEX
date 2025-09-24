import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
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
      INSERT INTO segmentos (
        descripcion,
        txt_header,
        txt_footer,
        vencimiento_header,
        estado,
        cod_newton,
        moneda_id,
        url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
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
      url
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Segmento creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando Segmento:', error)
    return { success: false, message: 'Error creando Segmento' }
  }
})