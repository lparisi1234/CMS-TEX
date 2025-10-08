import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  const pool = await getDbPool()
  const product_id = getRouterParam(event, 'product_id')
  
  try {
    // Consulta con JOINs para obtener todos los datos relacionados
    const { rows } = await pool.query(`
      SELECT 
        sp.seccion_id,
        sp.product_id,
        sp.segmentos_id,
        s.texto as seccion_nombre,
        s.pagina_id,
        p.texto as pagina_nombre,
        seg.descripcion as segmento_nombre
      FROM secciones_prod sp
      INNER JOIN secciones s ON sp.seccion_id = s.id
      INNER JOIN pagina p ON s.pagina_id = p.id
      LEFT JOIN segmentos seg ON sp.segmentos_id = seg.id
      WHERE sp.product_id = $1
      ORDER BY sp.seccion_id, sp.segmentos_id ASC
    `, [product_id])

    // Si no hay datos, devolver estructura vacía
    if (rows.length === 0) {
      return null
    }

    // Agrupar por sección (solo debería haber una sección por producto)
    const seccion = rows[0]
    const segmentos_excluidos = rows.map((row: any) => row.segmentos_id.toString())

    // Devolver el formato esperado por el frontend
    return {
      id: Date.now(), // ID temporal para el frontend
      seccion_id: seccion.seccion_id,
      pagina: seccion.pagina_nombre,
      seccion: seccion.seccion_nombre,
      segmentos_excluidos: segmentos_excluidos
    }
  } catch (error) {
    console.error('Error obteniendo secciones del producto:', error)
    return null
  }
})
