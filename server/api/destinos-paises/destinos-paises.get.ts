import getDbPool from "../../db"

export default defineEventHandler(async () => {
  const pool = await getDbPool()
  const { rows } = await pool.query('SELECT * FROM destinos WHERE "region_id" IS NOT NULL ORDER BY id')
  return rows
})
