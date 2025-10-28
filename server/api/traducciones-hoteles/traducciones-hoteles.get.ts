import getDbPool from "../../db"

export default defineEventHandler(async () => {
  const pool = await getDbPool()
  const { rows } = await pool.query('SELECT * FROM traducciones_hoteles ORDER BY id ASC')
  return rows
})
