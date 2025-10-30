import getDbPool from "../../db"

export default defineEventHandler(async () => {
  const pool = await getDbPool()
  
  const query = `
    SELECT 
      o.*,
      COALESCE(
        json_agg(os.segmento_id) FILTER (WHERE os.segmento_id IS NOT NULL),
        '[]'
      ) as segmentos_id
    FROM operador o
    LEFT JOIN operadores_segmentos os ON o.id = os.operador_id
    GROUP BY o.id
    ORDER BY o.nro_orden ASC
  `
  
  const { rows } = await pool.query(query)
  return rows
})