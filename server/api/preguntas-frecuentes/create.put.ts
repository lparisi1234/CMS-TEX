import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      pregunta,
      respuesta,
      destino_id,
      operador_id
    } = await readBody(event)

    if (
      pregunta === undefined ||
      respuesta === undefined 
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO preguntas_frecuentes (
        pregunta,
        respuesta,
        destino_id,
        operador_id
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      pregunta,
      respuesta,
      destino_id === undefined || destino_id === '' ? null : destino_id,
      operador_id === undefined || operador_id === '' ? null : operador_id
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Pregunta frecuente creada correctamente', pregunta: result.rows[0] }
  } catch (error) {
    console.error('Error creando pregunta frecuente:', error)
    return { success: false, message: 'Error creando pregunta frecuente' }
  }
})
