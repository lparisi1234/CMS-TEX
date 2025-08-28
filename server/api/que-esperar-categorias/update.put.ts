import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      categoria_id,
      titulo,
      descripcion,
      img,
      region_id,
      nro_orden
    } = await readBody(event)

    if (
      id === undefined ||
      categoria_id === undefined ||
      titulo === undefined ||
      descripcion === undefined ||
      nro_orden === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      UPDATE "QueEsperar" SET
        categoria_id = $1,
        region_id = COALESCE($2, region_id),
        titulo = $3,
        descripcion = $4,
        img = COALESCE($5, img),
        nro_orden = $6
      WHERE id = $7
      RETURNING *;
    `;

    const values = [
      categoria_id,
      region_id ?? null,
      titulo,
      descripcion,
      img ?? null,
      nro_orden,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el que esperar para modificar' }
    }
    return { success: true, message: 'Que esperar modificado correctamente', queEsperar: result.rows[0] }
  } catch (error) {
    console.error('Error modificando que esperar:', error)
    return { success: false, message: 'Error modificando que esperar' }
  }
})
