import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      img,
      nombre
    } = await readBody(event)

    if (
      img === undefined ||
      nombre === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO expertos (
        img,
        nombre
      ) VALUES ($1, $2)
      RETURNING *;
    `;

    const values = [
      img,
      nombre
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Experto creado correctamente', experto: result.rows[0] }
  } catch (error) {
    console.error('Error creando experto:', error)
    return { success: false, message: 'Error creando experto' }
  }
})
