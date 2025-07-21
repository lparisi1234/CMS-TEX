import { pool } from '../../db'

export default defineEventHandler(async (event) => {
    try {
    const {
      id,
      descripcion,
      img,
      url,
      estado
    } = await readBody(event)

    if (
      id === undefined ||
      descripcion === undefined ||
      img === undefined ||
      url === undefined ||
      estado === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
       UPDATE "NotaDePrensa" SET
        descripcion = $1,
        img = $2,
        url = $3,
        estado = $4
      WHERE id = $5 
      RETURNING *;
    `;

    const values = [
     descripcion,
      img,
      url,
      estado,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró la Nota De Prensa para modificar para modificar' }
    }
    return { success: true, message: 'Nota de Prensa modificado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error modificando Nota de Prensa:', error)
    return { success: false, message: 'Error modificando Nota de Prensa' }
  }
})