import getDbPool from "../../db"

export default defineEventHandler(async () => {
  try {
    const pool = await getDbPool()
    
    const { rows: categorias } = await pool.query('SELECT * FROM public.categorias ORDER BY nro_orden ASC')
    
    for (const categoria of categorias) {
      const subgruposQuery = `
        SELECT 
          sc.id,
          sc.nombre,
          sc.categoria_id,
          sc.nro_orden,
          sc.segmentos_id,
          COALESCE(
            ARRAY_AGG(sp.producto_id::text ORDER BY sp.producto_id) 
            FILTER (WHERE sp.producto_id IS NOT NULL), 
            ARRAY[]::text[]
          ) as productos_ids,
          COALESCE(
            ARRAY_AGG(CONCAT(pn.operador, '/', pn.tour_id) ORDER BY sp.producto_id) 
            FILTER (WHERE pn.tour_id IS NOT NULL), 
            ARRAY[]::text[]
          ) as productos_codigos
        FROM subgrupos_cat sc
        LEFT JOIN subgrupos_prod sp ON sc.id = sp.subgrupo_cat_id
        LEFT JOIN productos p ON sp.producto_id = p.id
        LEFT JOIN producto_newton pn ON p.cod_newton = pn.tour_id
        WHERE sc.categoria_id = $1
        GROUP BY sc.id, sc.nombre, sc.categoria_id, sc.nro_orden, sc.segmentos_id
        ORDER BY sc.nro_orden ASC
      `
      
      const { rows: subgrupos } = await pool.query(subgruposQuery, [categoria.id])
      
      // Mapear segmentos_id a segmentos_excluidos
      categoria.subgrupos = subgrupos.map((sub: { segmentos_id: any }) => ({
        ...sub,
        segmentos_excluidos: sub.segmentos_id || []
      }))
    }
    
    return categorias
  } catch (error) {
    console.error('Error obteniendo categorías:', error)
    return []
  }
})
