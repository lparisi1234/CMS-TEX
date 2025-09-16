import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    
    const query = `
      SELECT 
        sd.id,
        sd.nombre,
        sd.destino_id,
        sd.nro_orden,
        d.nombre as destino_nombre,
        ARRAY_AGG(
          CASE 
            WHEN sp.producto_id IS NOT NULL 
            THEN sp.producto_id 
            ELSE NULL 
          END
        ) FILTER (WHERE sp.producto_id IS NOT NULL) as productos_ids
      FROM subgrupos_dst sd
      LEFT JOIN destinos d ON sd.destino_id = d.id
      LEFT JOIN subgrupos_prod sp ON sd.id = sp.subgrupo_dst_id
      GROUP BY sd.id, sd.nombre, sd.destino_id, sd.nro_orden, d.nombre
      ORDER BY sd.nro_orden ASC, sd.nombre ASC
    `

    const result = await pool.query(query)
    return { success: true, subgrupos: result.rows }
  } catch (error) {
    console.error('Error obteniendo subgrupos de destino:', error)
    return { success: false, message: 'Error obteniendo subgrupos de destino' }
  }
})