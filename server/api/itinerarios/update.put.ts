import getDbPool from "../../db"
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      texto,
      titulo,
      nro_ord,
      producto_id
    } = await readBody(event)

    if (
      id === undefined ||
      texto === undefined ||
      titulo === undefined ||
      nro_ord === undefined ||
      producto_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      UPDATE itinerario SET
        texto = $1,
        titulo = $2,
        nro_ord = $3,
        producto_id = $4
      WHERE id = $5
      RETURNING *;
    `

    const values = [
      texto,
      titulo,
      nro_ord,
      producto_id,
      id
    ]

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el itinerario para modificar' }
    }
    return { success: true, message: 'Itinerario modificado correctamente', itinerario: result.rows[0] }
  } catch (error) {
    console.error('Error modificando itinerario:', error)
    return { success: false, message: 'Error modificando itinerario' }
  }
})