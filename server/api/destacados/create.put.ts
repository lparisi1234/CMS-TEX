import getDbPool from "../../db"
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const pool = await getDbPool()
  
  const { rows } = await pool.query(
    'INSERT INTO destacados (texto, img, nro_orden,itinerario_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [body.texto, body.img, body.nro_orden, body.itinerario_id]
  )
  
  return rows[0]
})