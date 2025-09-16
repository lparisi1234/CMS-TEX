import getDbPool from "../../db"

export default defineEventHandler(async () => {
  const pool = await getDbPool()
  const { rows } = await pool.query('SELECT * FROM operador ORDER BY id')
  return rows
})