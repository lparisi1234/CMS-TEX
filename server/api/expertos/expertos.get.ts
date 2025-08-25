import getDbPool from "../../db"

export default defineEventHandler(async () => {
  const pool = await getDbPool()
  const { rows } = await pool.query('SELECT * FROM "Experto" ORDER BY id')
  return rows
})
