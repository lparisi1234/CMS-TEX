import { pool } from '../../db'

export default defineEventHandler(async () => {
  const { rows } = await pool.query('SELECT * FROM "Operador" ORDER BY id')
  console.log(rows)
  return rows
})