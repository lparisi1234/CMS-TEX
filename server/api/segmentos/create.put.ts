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
      moneda_id,
      url
    } = await readBody(event)

    console.log('Valor de vencimiento_header recibido:', vencimiento_header, typeof vencimiento_header);

    // Procesar vencimiento_header
    let fechaVencimiento = null;
    if (vencimiento_header) {
      try {
        // Si es una fecha válida, la convertimos a formato ISO
        fechaVencimiento = new Date(vencimiento_header).toISOString().split('T')[0];
      } catch (e) {
        console.error('Error procesando fecha:', e);
      }
    }

    if (
      descripcion === undefined ||
      txt_footer === undefined ||
      estado === undefined ||
      cod_newton === undefined ||
      moneda_id === undefined
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
      fechaVencimiento,
      estado,
      cod_newton,
      moneda_id,
      url
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Segmento creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando Segmento:', error)
    return { success: false, message: 'Error creando Segmento' }
  }
})