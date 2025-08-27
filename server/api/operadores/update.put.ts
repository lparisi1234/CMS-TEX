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
      nomenclatura
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

    const query = `
      UPDATE "Operador" SET
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
      return { success: false, message: 'No se encontró el Operador para modificar' }
    }
    return { success: true, message: 'Operador modificado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error modificando Operador:', error)
    return { success: false, message: 'Error modificando Operador' }
  }
})
