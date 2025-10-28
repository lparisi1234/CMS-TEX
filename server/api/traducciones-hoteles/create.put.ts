import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    
    const {
      nombre_original,
      traduccion,
      operador_id,
      estado
    } = await readBody(event)

    if (
      nombre_original === undefined ||
      traduccion === undefined ||
      operador_id === undefined ||
      estado === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO traducciones_hoteles (
        nombre_original,
        traduccion,
        operador_id,
        estado
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      nombre_original,
      traduccion,
      operador_id,
      estado
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Traduccion creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando Traducciones:', error)
    return { success: false, message: 'Error creando Traducciones' }
  }
})