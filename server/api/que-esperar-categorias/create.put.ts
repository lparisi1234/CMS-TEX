import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      region_id,
      categoria_id,
      titulo,
      descripcion,
      img
    } = await readBody(event)

    if (
      region_id === undefined ||
      categoria_id === undefined ||
      titulo === undefined ||
      descripcion === undefined ||
      img === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO "QueEsperar" (
        region_id,
        categoria_id,
        titulo,
        descripcion,
        img
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      region_id,
      categoria_id,
      titulo,
      descripcion,
      img
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Que esperar creado correctamente', queEsperar: result.rows[0] }
  } catch (error) {
    console.error('Error creando que esperar:', error)
    return { success: false, message: 'Error creando que esperar' }
  }
})
