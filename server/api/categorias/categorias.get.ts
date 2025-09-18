import getDbPool from "../../db"

export default defineEventHandler(async () => {
  try {
    const pool = await getDbPool()
    
    // Obtener categorías
    const { rows: categorias } = await pool.query('SELECT * FROM public.categorias ORDER BY nro_orden ASC')
    
    // Para cada categoría, obtener sus subgrupos
    for (const categoria of categorias) {
      const subgruposQuery = `
        SELECT 
          sc.id,
          sc.nombre,
          sc.categoria_id,
          sc.nro_orden,
          COALESCE(
            ARRAY_AGG(sp.producto_id::text ORDER BY sp.producto_id) 
            FILTER (WHERE sp.producto_id IS NOT NULL), 
            ARRAY[]::text[]
          ) as productos_ids
        FROM subgrupos_cat sc
        LEFT JOIN subgrupos_prod sp ON sc.id = sp.subgrupo_cat_id
        WHERE sc.categoria_id = $1
        GROUP BY sc.id, sc.nombre, sc.categoria_id, sc.nro_orden
        ORDER BY sc.nro_orden ASC, sc.nombre ASC
      `
      
      const { rows: subgrupos } = await pool.query(subgruposQuery, [categoria.id])
      categoria.subgrupos = subgrupos
    }
    
    return categorias
  } catch (error) {
    console.error('Error obteniendo categorías:', error)
    return []
  }
})
