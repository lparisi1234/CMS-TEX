import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  const pool = await getDbPool()
  const product_id = getRouterParam(event, 'product_id')
  
  try {
    const { rows } = await pool.query(`
      SELECT
        sp.seccion_id,
        sp.producto_id,
        sp.segmentos_id,
        s.texto as seccion_nombre,
        s.pagina_id,
        p.texto as pagina_nombre
      FROM secciones_prod sp
      INNER JOIN secciones s ON sp.seccion_id = s.id
      INNER JOIN paginas p ON s.pagina_id = p.id
      WHERE sp.producto_id = $1
      ORDER BY sp.seccion_id ASC
    `, [product_id])

    if (rows.length === 0) {
      return []
    }

    const secciones = rows.map((row: any) => {
      const segmentos_excluidos = Array.isArray(row.segmentos_id) 
        ? row.segmentos_id.map((id: number) => id.toString())
        : []
console.log('Segmentos Excluidos:', row);
      return {
        id: Date.now() + Math.random(),
        seccion_id: row.seccion_id,
        pagina: row.pagina_nombre,
        seccion: row.seccion_nombre,
        segmentos_excluidos: segmentos_excluidos
      }
    })

    return secciones
  } catch (error) {
    console.error('Error obteniendo secciones del producto:', error)
    return []
  }
})
