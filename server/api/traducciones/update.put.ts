import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
    try {
    const pool = await getDbPool()
    const {
      id,
      nombre_original,
      nombre_personalizado,
      descripcion,
      estado
    } = await readBody(event)

    if (
      id === undefined ||
      nombre_original === undefined ||
      nombre_personalizado === undefined ||
      descripcion === undefined ||
      estado === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
       UPDATE traducciones SET
        nombre_original = $1,
        nombre_personalizado = $2,
        descripcion = $3,
        estado = $4
      WHERE id = $5 
      RETURNING *;
    `;

    const values = [
      nombre_original,
      nombre_personalizado,
      descripcion,
      estado,
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