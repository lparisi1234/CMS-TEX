import getDbPool from "../../db"

export default defineEventHandler(async () => {
  const pool = await getDbPool()
  const { rows } = await pool.query('SELECT * FROM "NotaBlog" ORDER BY id')
  console.log(rows)
  return rows
})