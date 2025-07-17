import { Pool } from 'pg'
export const pool = new Pool({
  connectionString: process.env.DB_URL, // Usa tu variable de entorno
})

// Prueba de conexión
pool.query('SELECT NOW()')
  .then(res => console.log('Conexión exitosa a PostgreSQL:', res.rows[0]))
  .catch(err => console.error('Error conectando a PostgreSQL:', err))