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
        sc.segmentos_id,
        c.nombre as categoria_nombre,
        COALESCE(
          json_agg(
            DISTINCT sp.producto_id
          ) FILTER (WHERE sp.producto_id IS NOT NULL),
          '[]'
        ) as productos_ids,
        COALESCE(
          json_agg(
            DISTINCT CONCAT(pn.operador, '/', pn.tour_id)
          ) FILTER (WHERE pn.tour_id IS NOT NULL),
          '[]'
        ) as productos_codigos
      FROM subgrupos_cat sc
      LEFT JOIN categorias c ON sc.categoria_id = c.id
      LEFT JOIN subgrupos_prod sp ON sc.id = sp.subgrupo_cat_id
      LEFT JOIN productos p ON sp.producto_id = p.id
      LEFT JOIN producto_newton pn ON p.cod_newton = pn.tour_id
      GROUP BY sc.id, sc.nombre, sc.categoria_id, sc.nro_orden, sc.segmentos_id, c.nombre
      ORDER BY sc.nro_orden ASC, sc.nombre ASC
    `

    const result = await pool.query(query)
    
    // Mapear segmentos_id a segmentos_excluidos
    const subgrupos = result.rows.map((row: { segmentos_id: any }) => ({
      ...row,
      segmentos_excluidos: row.segmentos_id || []
    }))
    
    console.log('Subgrupos obtenidos:', subgrupos)
    
    return { success: true, subgrupos }
  } catch (error) {
    console.error('Error obteniendo subgrupos de categoría:', error)
    return { success: false, message: 'Error obteniendo subgrupos de categoría', subgrupos: [] }
  }
})
