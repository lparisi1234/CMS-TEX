import getDbPool from "../../db"

export default defineEventHandler(async () => {
  try {
    const pool = await getDbPool()
    
    const { rows: destinos } = await pool.query('SELECT * FROM public.destinos ORDER BY nro_orden ASC')
    
    for (const destino of destinos) {
      // Subgrupos de destino
      const subgruposQuery = `
        SELECT 
          sd.id,
          sd.nombre,
          sd.destino_id,
          sd.nro_orden,
          sd.segmentos_id,
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
        FROM subgrupos_dst sd
        LEFT JOIN subgrupos_prod sp ON sd.id = sp.subgrupo_dst_id
        LEFT JOIN productos p ON sp.producto_id = p.id
        LEFT JOIN producto_newton pn ON p.cod_newton = pn.tour_id
        WHERE sd.destino_id = $1
        GROUP BY sd.id, sd.nombre, sd.destino_id, sd.nro_orden, sd.segmentos_id
        ORDER BY sd.nro_orden ASC
      `
      
      const { rows: subgrupos } = await pool.query(subgruposQuery, [destino.id])
      
      // Mapear segmentos_id a segmentos_excluidos
      destino.subgrupos = subgrupos.map((sub: { segmentos_id: any }) => ({
        ...sub,
        segmentos_excluidos: sub.segmentos_id || []
      }))

      // Más Vendidos
      const masVendidosQuery = `SELECT * FROM mas_vendidos_dst WHERE destino_id = $1`
      const { rows: masVendidos } = await pool.query(masVendidosQuery, [destino.id])
      destino.masVendidos = masVendidos.map((mv: { ProductoId: any }) => mv.ProductoId)

      // Vuelos Incluidos
      const vueloIncluidoQuery = `SELECT * FROM vuelos_incluidos_dst WHERE destino_id = $1`
      const { rows: vueloIncluido } = await pool.query(vueloIncluidoQuery, [destino.id])
      destino.vueloIncluido = vueloIncluido.map((vi: { ProductoId: any }) => vi.ProductoId)

      // Recomendados
      const recomendadosQuery = `SELECT * FROM recomendados_dst WHERE destino_id = $1`
      const { rows: recomendados } = await pool.query(recomendadosQuery, [destino.id])
      destino.recomendados = recomendados.map((r: { ProductoId: any }) => r.ProductoId)
    }
    
    return destinos
  } catch (error) {
    console.error('Error obteniendo destinos:', error)
    return []
  }
})
