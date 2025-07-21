import { pool } from '../../db'

export default defineEventHandler(async (event) => {
  try {
    const {
      nombre,
      estado,
      certificado,
      codigo,
      nro_orden,
      imagen,
      txt_contacto,
      txt_cancelaciones
    } = await readBody(event)

    if (
      nombre === undefined ||
      estado === undefined ||
      certificado === undefined ||
      codigo === undefined ||
      nro_orden === undefined ||
      imagen === undefined ||
      txt_contacto === undefined ||
      txt_cancelaciones === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO "Operador" (
        nombre,
        estado,
        certificado,
        codigo,
        nro_orden,
        imagen,
        txt_contacto,
        txt_cancelaciones
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      nombre,
      estado,
      certificado,
      codigo,
      nro_orden,
      imagen,
      txt_contacto,
      txt_cancelaciones
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Operadores creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando Operadores:', error)
    return { success: false, message: 'Error creando Operadores' }
  }
})
