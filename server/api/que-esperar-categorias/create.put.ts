import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      categoria_id,
      titulo,
      descripcion,
      img,
      nro_orden
    } = await readBody(event)

    if (
      categoria_id === undefined ||
      titulo === undefined ||
      descripcion === undefined ||
      nro_orden === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO "QueEsperar" (
        categoria_id,
        titulo,
        descripcion,
        img,
        nro_orden
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      categoria_id,
      titulo,
      descripcion,
      img ?? null,
      nro_orden
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Que esperar creado correctamente', queEsperar: result.rows[0] }
  } catch (error) {
    console.error('Error creando que esperar:', error)
    return { success: false, message: 'Error creando que esperar' }
  }
})
