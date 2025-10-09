import getDbPool from "../../db"
import { defineEventHandler, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const producto_id = getRouterParam(event, 'producto_id')
  const pool = await getDbPool()
  
  
  const { rows } = await pool.query(
    'SELECT * FROM segmentos_productos WHERE producto_id = $1',
    [producto_id]
  )
  
  return rows
})
