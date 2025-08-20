import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
    try {
    const pool = await getDbPool()
    const {
      id,
      descripcion,
      codigo,
      importe,
      estado
    } = await readBody(event)

    if (
      id === undefined ||
      descripcion === undefined ||
      codigo === undefined ||
      importe === undefined ||
      estado === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
       UPDATE "Moneda" SET
        descripcion = $1,
        codigo = $2,
        importe = $3,
        estado = $4
      WHERE id = $5 
      RETURNING *;
    `;

    const values = [
     descripcion,
      codigo,
      importe,
      estado,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró la Moneda para modificar para modificar' }
    }
    return { success: true, message: 'Moneda modificado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error modificando Moneda:', error)
    return { success: false, message: 'Error modificando Moneda' }
  }
})