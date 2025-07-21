import { pool } from '../../db'

export default defineEventHandler(async () => {
  const { rows } = await pool.query('SELECT * FROM "Moneda" ORDER BY id')
  console.log(rows)
  return rows
})