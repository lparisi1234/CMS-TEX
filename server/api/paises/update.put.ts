import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      nombre,
      numero_telefono,
      img,
      pais_apertura,
      segmentos_id
    } = await readBody(event)

    if (
      id === undefined ||
      nombre === undefined ||
      numero_telefono === undefined ||
      img === undefined ||
      pais_apertura === undefined ||
      segmentos_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      UPDATE "PaisesOperativos" SET
        nombre = $1,
        numero_telefono = $2,
        img = $3,
        pais_apertura = $4,
        segmentos_id = $5
      WHERE id = $6
      RETURNING *;
    `;

    const values = [
      nombre,
      numero_telefono,
      img,
      pais_apertura,
      segmentos_id,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el país para modificar' }
    }
    return { success: true, message: 'País modificado correctamente', pais: result.rows[0] }
  } catch (error) {
    console.error('Error modificando país:', error)
    return { success: false, message: 'Error modificando país' }
  }
})
