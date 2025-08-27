import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    
    const query = `
      SELECT 
        sc.id,
        sc.nombre,
        sc.categoria_id,
        sc.nro_orden,
        c.nombre as categoria_nombre
      FROM "Subgrupos_cat" sc
      LEFT JOIN "Categoria" c ON sc.categoria_id = c.id
      ORDER BY sc.nro_orden ASC, sc.nombre ASC
    `

    const result = await pool.query(query)
    return { success: true, subgrupos: result.rows }
  } catch (error) {
    console.error('Error obteniendo subgrupos de categoría:', error)
    return { success: false, message: 'Error obteniendo subgrupos de categoría' }
  }
})
