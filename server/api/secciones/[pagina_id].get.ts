import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  const pool = await getDbPool()
  const pagina_id = getRouterParam(event, 'pagina_id')
  
  // Si pagina_id es 2, consultar grupos_de_ofertas
  if (pagina_id === '2') {
    const { rows } = await pool.query(
      'SELECT * FROM grupos_de_ofertas ORDER BY id ASC'
    )
    return rows
  }
  
  // Para otras páginas, consultar secciones
  const { rows } = await pool.query(
    'SELECT * FROM secciones WHERE pagina_id = $1 ORDER BY id ASC',
    [pagina_id]
  )
  
  return rows
})