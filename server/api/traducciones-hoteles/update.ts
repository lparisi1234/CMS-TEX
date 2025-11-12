import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
    try {
    const pool = await getDbPool()
    const {
      id,
      nombre_original,
      traduccion,
      operador_id,
      estado,
      turismocity
    } = await readBody(event)

    if (
      id === undefined ||
      nombre_original === undefined ||
      traduccion === undefined ||
      operador_id === undefined ||
      estado === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
       UPDATE traducciones_hoteles SET
        nombre_original = $1,
        traduccion = $2,
        operador_id = $3,
        estado = $4,
        turismocity = $5
      WHERE id = $6 
      RETURNING *;
    `;

    const values = [
      nombre_original,
      traduccion,
      operador_id,
      estado,
      turismocity,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró la Traduccion para modificar para modificar' }
    }
    return { success: true, message: 'Traduccion modificado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error modificando Traduccion:', error)
    return { success: false, message: 'Error modificando Traduccion' }
  }
})