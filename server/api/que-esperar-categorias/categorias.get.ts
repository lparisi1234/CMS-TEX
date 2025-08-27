import getDbPool from "../../db"

export default defineEventHandler(async () => {
  try {
    const pool = await getDbPool()
    
    const query = `
      SELECT DISTINCT 
        c.id,
        c.nombre,
        c.url,
        c.estado
      FROM "Categorias" c
      INNER JOIN "QueEsperar" qe ON c.id = qe.categoriaId
      WHERE c.estado = true
      ORDER BY c.nombre ASC
    `
    
    const result = await pool.query(query)
    return { 
      success: true, 
      categorias: result.rows,
      total: result.rows.length
    }
    
  } catch (error) {
    console.error('Error obteniendo categorías para qué esperar:', error)
    return { 
      success: false, 
      message: 'Error obteniendo categorías',
      error: error.message 
    }
  }
})
