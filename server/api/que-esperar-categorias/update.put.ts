import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      region_id,
      categoria_id,
      titulo,
      descripcion,
      img,
      nro_orden
    } = await readBody(event)

    if (
      id === undefined ||
      region_id === undefined ||
      categoria_id === undefined ||
      titulo === undefined ||
      descripcion === undefined ||
      img === undefined ||
      nro_orden === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      UPDATE "QueEsperar" SET
        region_id = $1,
        categoria_id = $2,
        titulo = $3,
        descripcion = $4,
        img = $5,
        nro_orden = $6
      WHERE id = $7
      RETURNING *;
    `;

    const values = [
      region_id,
      categoria_id,
      titulo,
      descripcion,
      img,
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
