import getDbPool from "../../db"

export default defineEventHandler(async () => {
  const pool = await getDbPool()
  const { rows } = await pool.query('SELECT * FROM numero_wpp ORDER BY id')
  return rows
})
