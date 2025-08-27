import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      destino_id,
      segmentos_id,
      nro_orden,
      precio_desde,
      img
    } = await readBody(event)

    if (
      id === undefined ||
      destino_id === undefined ||
      segmentos_id === undefined ||
      nro_orden === undefined ||
      precio_desde === undefined ||
      img === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      UPDATE "DestinoHome" SET
        destino_id = $1,
        segmentos_id = $2,
        nro_orden = $3,
        precio_desde = $4,
        img = $5
      WHERE id = $6
      RETURNING *;
    `;

    const values = [
      destino_id,
      segmentos_id,
      nro_orden,
      precio_desde,
      img,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el destino destacado para modificar' }
    }
    return { success: true, message: 'Destino destacado modificado correctamente', destino: result.rows[0] }
  } catch (error) {
    console.error('Error modificando destino destacado:', error)
    return { success: false, message: 'Error modificando destino destacado' }
  }
})
