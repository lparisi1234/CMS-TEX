import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      destino_id,
      segmentos_id,
      nro_orden,
      precio_desde
    } = await readBody(event)

    if (
      destino_id === undefined ||
      segmentos_id === undefined ||
      nro_orden === undefined ||
      precio_desde === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO "DestinoHome" (
        destino_id,
        segmentos_id,
        nro_orden,
        precio_desde
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      destino_id,
      segmentos_id,
      nro_orden,
      precio_desde
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Destino destacado creado correctamente', destino: result.rows[0] }
  } catch (error) {
    console.error('Error creando destino destacado:', error)
    return { success: false, message: 'Error creando destino destacado' }
  }
})
