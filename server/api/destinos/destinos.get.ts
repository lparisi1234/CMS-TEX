import getDbPool from "../../db"

export default defineEventHandler(async () => {
  try {
    const pool = await getDbPool()
    
    // Obtener destinos
    const { rows: destinos } = await pool.query('SELECT * FROM destinos ORDER BY nro_orden ASC')
    
    // Para cada destino, obtener sus subgrupos
    for (const destino of destinos) {
      const subgruposQuery = `
        SELECT 
          sd.id,
          sd.nombre,
          sd.destino_id,
          sd.nro_orden,
          COALESCE(
            ARRAY_AGG(sp.producto_id::text ORDER BY sp.producto_id) 
            FILTER (WHERE sp.producto_id IS NOT NULL), 
            ARRAY[]::text[]
          ) as productos_ids
        FROM subgrupos_dst sd
        LEFT JOIN subgrupos_prod sp ON sd.id = sp.subgrupo_dst_id
        WHERE sd.destino_id = $1
        GROUP BY sd.id, sd.nombre, sd.destino_id, sd.nro_orden
        ORDER BY sd.nro_orden ASC, sd.nombre ASC
      `
      
      const { rows: subgrupos } = await pool.query(subgruposQuery, [destino.id])
      destino.subgrupos = subgrupos
    }
    
    return destinos
  } catch (error) {
    console.error('Error obteniendo destinos:', error)
    return []
  }
})
