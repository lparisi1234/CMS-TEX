import { pool } from '../../db'

export default defineEventHandler(async () => {
  const { rows } = await pool.query('SELECT * FROM "Categoria" ORDER BY id')
  return rows
})
