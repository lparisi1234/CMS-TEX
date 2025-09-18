import getDbPool from "../../db"

export default defineEventHandler(async () => {
  const pool = await getDbPool()
  const { rows } = await pool.query('SELECT * FROM que_esperar ORDER BY nro_orden ASC')
  return rows
})
