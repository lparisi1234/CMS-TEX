import getDbPool from "../../db"
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      texto,
      titulo,
      nro_ord,
      producto_id
    } = await readBody(event)

    if (
      texto === undefined ||
      titulo === undefined ||
      nro_ord === undefined ||
      producto_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO itinerario (
        texto,
        titulo,
        nro_ord,
        producto_id
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `

    const values = [
      texto,
      titulo,
      nro_ord,
      producto_id
    ]

    const result = await pool.query(query, values)
    return { success: true, message: 'Itinerario creado correctamente', itinerario: result.rows[0] }
  } catch (error) {
    console.error('Error creando itinerario:', error)
    return { success: false, message: 'Error creando itinerario' }
  }
})