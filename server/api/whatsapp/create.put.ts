import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      numero
    } = await readBody(event)

    if (
      numero === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO "NumeroWpp" (
        numero
      ) VALUES ($1)
      RETURNING *;
    `;

    const values = [
      numero
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Número de WhatsApp creado correctamente', whatsapp: result.rows[0] }
  } catch (error) {
    console.error('Error creando número de WhatsApp:', error)
    return { success: false, message: 'Error creando número de WhatsApp' }
  }
})
