import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      ProductoId,
      destino_id
    } = await readBody(event)

    if (
      id === undefined ||
      ProductoId === undefined ||
      destino_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      UPDATE "MasVendidos_dst" SET
        "ProductoId" = $1,
        destino_id = $2
      WHERE id = $3
      RETURNING *;
    `;

    const values = [
      ProductoId,
      destino_id,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el producto más vendido para modificar' }
    }
    return { success: true, message: 'Producto más vendido modificado correctamente', producto: result.rows[0] }
  } catch (error) {
    console.error('Error modificando producto más vendido:', error)
    return { success: false, message: 'Error modificando producto más vendido' }
  }
})
