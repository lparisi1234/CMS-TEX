import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      pregunta,
      respuesta,
      destino_id,
      operador_id  // Agregamos el nuevo campo
    } = await readBody(event)

    if (
      id === undefined ||
      pregunta === undefined ||
      respuesta === undefined 
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      UPDATE preguntas_frecuentes SET
        pregunta = $1,
        respuesta = $2,
        destino_id = $3,
        operador_id = $4
      WHERE id = $5
      RETURNING *;
    `;

    const values = [
      pregunta,
      respuesta,
      destino_id === undefined || destino_id === '' ? null : destino_id,
      operador_id === undefined || operador_id === '' ? null : operador_id,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró la pregunta frecuente para modificar' }
    }
    return { success: true, message: 'Pregunta frecuente modificada correctamente', pregunta: result.rows[0] }
  } catch (error) {
    console.error('Error modificando pregunta frecuente:', error)
    return { success: false, message: 'Error modificando pregunta frecuente' }
  }
})
