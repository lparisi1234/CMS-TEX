import getDbPool from "../../db"

export default defineEventHandler(async () => {
  try {
    const pool = await getDbPool()
    
    const query = `
      SELECT 
        vi.id,
        vi.destino_id,
        vi.producto_id,
        CONCAT(pn.operador, '/', pn.tour_id) as producto_codigo
      FROM vuelos_incluidos_dst vi
      LEFT JOIN productos p ON vi.producto_id = p.id
      LEFT JOIN producto_newton pn ON p.cod_newton = pn.tour_id
      ORDER BY vi.destino_id ASC, vi.id ASC
    `

    const result = await pool.query(query)
    
    return result.rows
  } catch (error) {
    console.error('Error obteniendo vuelos incluidos:', error)
    return []
  }
})
