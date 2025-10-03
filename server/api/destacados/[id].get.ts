import getDbPool from "../../db"
import { defineEventHandler, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const pool = await getDbPool()
  const { rows } = await pool.query('SELECT * FROM destacados WHERE itinerario_id = $1 ORDER BY nro_orden', [id])
  return rows
})
