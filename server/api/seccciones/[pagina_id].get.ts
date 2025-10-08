import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  const pool = await getDbPool()
  const pagina_id = getRouterParam(event, 'pagina_id')
  
  const { rows } = await pool.query(
    'SELECT * FROM secciones WHERE pagina_id = $1 ORDER BY id ASC',
    [pagina_id]
  )
  
  return rows
})