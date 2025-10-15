import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    
    const {
      nombre_original,
      nombre_personalizado,
      descripcion,
      estado
    } = await readBody(event)

    if (
      nombre_original === undefined ||
      nombre_personalizado === undefined ||
      descripcion === undefined ||
      estado === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO traducciones (
        nombre_original,
        nombre_personalizado,
        descripcion,
        estado
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      nombre_original,
      nombre_personalizado,
      descripcion,
      estado
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Traduccion creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando Traducciones:', error)
    return { success: false, message: 'Error creando Traducciones' }
  }
})