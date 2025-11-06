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
        sd.segmentos_id,
        d.nombre as destino_nombre,
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
      FROM subgrupos_dst sd
      LEFT JOIN destinos d ON sd.destino_id = d.id
      LEFT JOIN subgrupos_prod sp ON sd.id = sp.subgrupo_dst_id
      LEFT JOIN productos p ON sp.producto_id = p.id
      LEFT JOIN producto_newton pn ON p.cod_newton = pn.tour_id
      GROUP BY sd.id, sd.nombre, sd.destino_id, sd.nro_orden, sd.segmentos_id, d.nombre
      ORDER BY sd.nro_orden ASC, sd.nombre ASC
    `

    const result = await pool.query(query)
    
    // Mapear segmentos_id a segmentos_excluidos
    const subgrupos = result.rows.map((row: { segmentos_id: any }) => ({
      ...row,
      segmentos_excluidos: row.segmentos_id || []
    }))
    
    console.log('Subgrupos DST obtenidos:', subgrupos)
    
    return { success: true, subgrupos }
  } catch (error) {
    console.error('Error obteniendo subgrupos de destino:', error)
    return { success: false, message: 'Error obteniendo subgrupos de destino', subgrupos: [] }
  }
})