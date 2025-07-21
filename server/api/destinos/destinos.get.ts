import { pool } from '../../db'

export default defineEventHandler(async () => {
  const { rows } = await pool.query('SELECT * FROM "Destinos" ORDER BY id')
  return rows
})
