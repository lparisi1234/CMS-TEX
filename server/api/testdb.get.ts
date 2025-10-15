import getDbPool from "../db"

export default defineEventHandler(async () => {
  try {
    const pool = await getDbPool()
    const res = await pool.query('SELECT NOW()')
    return { success: true, time: res.rows[0] }
  } catch (err) {
    console.error('Error conectando a PostgreSQL:', err)
    return { success: false, error: err }
  }
})