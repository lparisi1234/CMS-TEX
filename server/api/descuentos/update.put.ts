import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      nombre,
      img,
      estado,
      codigo_newton,
    } = await readBody(event)

    if (
      id === undefined ||
      nombre === undefined ||
      img === undefined ||
      estado === undefined ||
      codigo_newton === undefined 
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      UPDATE "Descuentos" SET
        nombre = $1,
        img = $2,
        estado = $3,
        codigo_newton = $4
      WHERE id = $5
      RETURNING *;
    `;

    const values = [
      nombre,
      img,
      estado,
      codigo_newton,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró Descuentos para modificar' }
    }
    return { success: true, message: 'Descuentos modificado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error modificando Descuentos:', error)
    return { success: false, message: 'Error modificando Descuentos' }
  }
})
