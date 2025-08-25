import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      img,
      nombre
    } = await readBody(event)

    if (
      id === undefined ||
      img === undefined ||
      nombre === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      UPDATE "Experto" SET
        img = $1,
        nombre = $2
      WHERE id = $3
      RETURNING *;
    `;

    const values = [
      img,
      nombre,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el experto para modificar' }
    }
    return { success: true, message: 'Experto modificado correctamente', experto: result.rows[0] }
  } catch (error) {
    console.error('Error modificando experto:', error)
    return { success: false, message: 'Error modificando experto' }
  }
})
