import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      numero
    } = await readBody(event)

    if (
      id === undefined ||
      numero === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      UPDATE numero_wpp SET
        numero = $1
      WHERE id = $2
      RETURNING *;
    `;

    const values = [
      numero,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el número de WhatsApp para modificar' }
    }
    return { success: true, message: 'Número de WhatsApp modificado correctamente', whatsapp: result.rows[0] }
  } catch (error) {
    console.error('Error modificando número de WhatsApp:', error)
    return { success: false, message: 'Error modificando número de WhatsApp' }
  }
})
