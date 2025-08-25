import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      pregunta,
      respuesta,
      destino_id
    } = await readBody(event)

    if (
      pregunta === undefined ||
      respuesta === undefined ||
      destino_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO "PreguntasFrecuentes" (
        pregunta,
        respuesta,
        destino_id
      ) VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [
      pregunta,
      respuesta,
      destino_id
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Pregunta frecuente creada correctamente', pregunta: result.rows[0] }
  } catch (error) {
    console.error('Error creando pregunta frecuente:', error)
    return { success: false, message: 'Error creando pregunta frecuente' }
  }
})
