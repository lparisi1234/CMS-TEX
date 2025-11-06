import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      nombre,
      categoria_id,
      nro_orden,
      productos_ids,
      segmentos_excluidos
    } = await readBody(event)

    if (id === undefined || id === null) {
      return { success: false, message: 'ID es requerido' }
    }
    
    if (nombre === undefined || nombre === null || nombre.trim() === '') {
      return { success: false, message: 'Nombre es requerido' }
    }
    
    if (categoria_id === undefined || categoria_id === null) {
      return { success: false, message: 'ID de categoría es requerido' }
    }
    
    if (nro_orden === undefined || nro_orden === null || nro_orden < 1) {
      return { success: false, message: 'Número de orden debe ser mayor a 0' }
    }

    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // Convertir array de segmentos a integers
      const segmentosArray = segmentos_excluidos && Array.isArray(segmentos_excluidos) 
        ? segmentos_excluidos.map(seg => parseInt(seg)).filter(seg => !isNaN(seg))
        : []

      const updateSubgrupoQuery = `
        UPDATE subgrupos_cat SET
          nombre = $1,
          categoria_id = $2,
          nro_orden = $3,
          segmentos_id = $4::integer[]
        WHERE id = $5
        RETURNING *;
      `

      const subgrupoValues = [nombre, categoria_id, nro_orden, segmentosArray, id]
      const subgrupoResult = await client.query(updateSubgrupoQuery, subgrupoValues)
      
      if (subgrupoResult.rows.length === 0) {
        await client.query('ROLLBACK')
        return { success: false, message: 'No se encontró el subgrupo de categoría para modificar' }
      }

      const subgrupoActualizado = subgrupoResult.rows[0]

      await client.query(`
        DELETE FROM subgrupos_prod 
        WHERE subgrupo_cat_id = $1
      `, [id])

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
          await client.query(createRelacionQuery, [producto.id, id, null])
          productosInsertados.push(producto.codigo_completo)
        }

        if (productosNoEncontrados.length > 0) {
          console.warn(`⚠️ Productos no encontrados: ${productosNoEncontrados.join(', ')}`)
        }
      }

      await client.query('COMMIT')

      return { 
        success: true, 
        message: 'Subgrupo de categoría modificado correctamente', 
        subgrupo: {
          ...subgrupoActualizado,
          productos_codigos: productosInsertados,
          segmentos_excluidos: subgrupoActualizado.segmentos_id || []
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
    console.error('Error modificando subgrupo de categoría:', error)
    return { success: false, message: 'Error modificando subgrupo de categoría' }
  }
})
