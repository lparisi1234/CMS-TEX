import getDbPool from "../../db"
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const pool = await getDbPool()
  const { rows } = await pool.query('SELECT * FROM itinerario ORDER BY producto_id, nro_dia')
  return rows
})