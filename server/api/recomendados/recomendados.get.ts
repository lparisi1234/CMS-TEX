import getDbPool from "../../db"

export default defineEventHandler(async () => {
  try {
    const pool = await getDbPool()
    
    const query = `
      SELECT 
        r.id,
        r.destino_id,
        r.producto_id,
        CONCAT(pn.operador, '/', pn.tour_id) as producto_codigo
      FROM recomendados_dst r
      LEFT JOIN productos p ON r.producto_id = p.id
      LEFT JOIN producto_newton pn ON p.cod_newton = pn.tour_id
      ORDER BY r.destino_id ASC, r.id ASC
    `

    const result = await pool.query(query)
    
    return result.rows
  } catch (error) {
    console.error('Error obteniendo recomendados:', error)
    return []
  }
})
