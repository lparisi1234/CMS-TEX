import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      nombre,
      destino_id,
      nro_orden,
      productos_ids,
      segmentos_excluidos
    } = await readBody(event)

    if (
      nombre === undefined ||
      destino_id === undefined ||
      nro_orden === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // Convertir array de segmentos a integers
      const segmentosArray = segmentos_excluidos && Array.isArray(segmentos_excluidos) 
        ? segmentos_excluidos.map(seg => parseInt(seg)).filter(seg => !isNaN(seg))
        : []

      const createSubgrupoQuery = `
        INSERT INTO subgrupos_dst (
          nombre,
          destino_id,
          nro_orden,
          segmentos_id
        ) VALUES (
          $1, $2, $3, $4::integer[]
        ) RETURNING *;
      `

      const subgrupoValues = [nombre, destino_id, nro_orden, segmentosArray]
      const subgrupoResult = await client.query(createSubgrupoQuery, subgrupoValues)
      const subgrupoCreado = subgrupoResult.rows[0]

      const productosInsertados = []
      const productosNoEncontrados = []

      if (productos_ids && productos_ids.length > 0) {
        const createRelacionQuery = `
          INSERT INTO subgrupos_prod (
            producto_id,
            subgrupo_cat_id,
            subgrupo_dst_id
          ) VALUES (
            $1, $2, $3
          );
        `

        const findProductoQuery = `
          SELECT p.id, CONCAT(pn.operador, '/', pn.tour_id) as codigo_completo
          FROM productos p
          JOIN producto_newton pn ON p.cod_newton = pn.tour_id
          WHERE CONCAT(pn.operador, '/', pn.tour_id) = $1
          LIMIT 1
        `

        for (const codigo_completo of productos_ids) {
          const productoResult = await client.query(findProductoQuery, [String(codigo_completo)])
          
          if (productoResult.rows.length === 0) {
            console.warn('⚠️ Producto no encontrado:', codigo_completo)
            productosNoEncontrados.push(codigo_completo)
            continue
          }

          const producto = productoResult.rows[0]
          await client.query(createRelacionQuery, [producto.id, null, subgrupoCreado.id])
          productosInsertados.push(producto.codigo_completo)
        }

        if (productosNoEncontrados.length > 0) {
          console.warn(`⚠️ Productos no encontrados: ${productosNoEncontrados.join(', ')}`)
        }
      }

      await client.query('COMMIT')

      return { 
        success: true, 
        message: 'Subgrupo de destino creado correctamente', 
        subgrupo: {
          ...subgrupoCreado,
          productos_codigos: productosInsertados,
          segmentos_excluidos: subgrupoCreado.segmentos_id || []
        },
        productos_no_encontrados: productosNoEncontrados
      }

    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Error creando subgrupo de destino:', error)
    return { success: false, message: 'Error creando subgrupo de destino' }
  }
})
