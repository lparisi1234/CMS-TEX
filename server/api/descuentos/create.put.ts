import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      nombre,
      img,
      estado,
      cod_newton,
      
    } = await readBody(event)

    if (
      nombre === undefined ||
      img === undefined ||
      estado === undefined ||
      cod_newton === undefined 
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO descuentos (
        nombre,
        img,
        estado,
        cod_newton
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      nombre,
      img,
      estado,
      cod_newton,
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Descuento creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando Descuento:', error)
    return { success: false, message: 'Error creando Descuento' }
  }
})
