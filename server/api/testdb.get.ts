import { pool } from '../db'

export default defineEventHandler(async () => {
  try {
    const res = await pool.query('SELECT NOW()')
    console.log('Conexión exitosa a PostgreSQL:', res.rows[0])
    return { success: true, time: res.rows[0] }
  } catch (err) {
    console.error('Error conectando a PostgreSQL:', err)
    return { success: false, error: err }
  }
})