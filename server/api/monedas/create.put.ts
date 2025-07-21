import { pool } from '../../db'

export default defineEventHandler(async (event) => {
    try {
    const {
      descripcion,
      codigo,
      importe,
      estado
    } = await readBody(event)

    if (
      descripcion === undefined ||
      codigo === undefined ||
      importe === undefined ||
      estado === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO "Moneda" (
        descripcion,
        codigo,
        importe,
        estado
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      descripcion,
      codigo,
      importe,
      estado
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Monedas creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando Monedas:', error)
    return { success: false, message: 'Error creando Monedas' }
  }
})