import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      ProductoId,
      destino_id
    } = await readBody(event)

    if (
      ProductoId === undefined ||
      destino_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO mas_vendidos_dst (
        producto_id,
        destino_id
      ) VALUES ($1, $2)
      RETURNING *;
    `;

    const values = [
      ProductoId,
      destino_id
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Producto más vendido creado correctamente', producto: result.rows[0] }
  } catch (error) {
    console.error('Error creando producto más vendido:', error)
    return { success: false, message: 'Error creando producto más vendido' }
  }
})
