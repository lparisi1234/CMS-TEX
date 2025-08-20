import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
    try {
    const pool = await getDbPool()
    const {
      descripcion,
      img,
      url,
      estado
    } = await readBody(event)

    if (
      descripcion === undefined ||
      img === undefined ||
      url === undefined ||
      estado === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO "NotaDePrensa" (
        descripcion,
        img,
        url,
        estado
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
     descripcion,
      img,
      url,
      estado
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Nota de Prensa creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando Nota de Prensa:', error)
    return { success: false, message: 'Error creando Nota de Prensa' }
  }
})