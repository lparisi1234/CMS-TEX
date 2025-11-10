import getDbPool from "../../db"

export default defineEventHandler(async () => {
  try {
    const pool = await getDbPool()
    
    const query = `
      SELECT 
        mv.id,
        mv.destino_id,
        mv.producto_id,
        CONCAT(pn.operador, '/', pn.tour_id) as producto_codigo
      FROM mas_vendidos_dst mv
      LEFT JOIN productos p ON mv.producto_id = p.id
      LEFT JOIN producto_newton pn ON p.cod_newton = pn.tour_id
      ORDER BY mv.destino_id ASC, mv.id ASC
    `

    const result = await pool.query(query)
    
    return result.rows
  } catch (error) {
    console.error('Error obteniendo más vendidos:', error)
    return []
  }
})
