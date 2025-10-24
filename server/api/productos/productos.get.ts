import getDbPool from "../../db"

export default defineEventHandler(async () => {
  const pool = await getDbPool()
  const { rows } = await pool.query(`SELECT 
  p.*, 
  pn.*,
  CONCAT(pn.operador, '/', p.cod_newton) as cod_newton
FROM productos p
INNER JOIN producto_newton pn
  ON p.cod_newton = pn.tour_id
ORDER BY p.id;
`)
  return rows
})
