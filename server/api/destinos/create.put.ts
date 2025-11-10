import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      cod_newton,
      url,
      nombre,
      nombre_alternativo,
      h1,
      h2,
      video_mobile,
      video_desktop,
      experto_id,
      consejo_experto,
      img,
      meta_titulo,
      meta_descripcion,
      meta_keywords,
      mapa,
      estado,
      nro_orden,
      precio_desde,
      region_id,
      subgrupos,
      masVendidos,
      vueloIncluido,
      recomendados
    } = await readBody(event)

    if (
      cod_newton === undefined ||
      nombre === undefined ||
      estado === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO destinos (
        cod_newton,
        url,
        nombre,
        nombre_alternativo,
        h1,
        h2,
        video_mobile,
        video_desktop,
        experto_id,
        consejo_experto,
        img,
        meta_titulo,
        meta_descripcion,
        meta_keywords,
        mapa,
        estado,
        nro_orden,
        precio_desde,
        region_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      ) RETURNING *;
    `

    const values = [
      cod_newton,
      url,
      nombre,
      nombre_alternativo,
      h1,
      h2,
      video_mobile,
      video_desktop,
      experto_id,
      consejo_experto,
      img,
      meta_titulo,
      meta_descripcion,
      meta_keywords,
      mapa,
      estado,
      nro_orden,
      precio_desde,
      region_id
    ]

    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      const result = await client.query(query, values)
      const destinoCreado = result.rows[0]
      
      if (subgrupos && Array.isArray(subgrupos) && subgrupos.length > 0) {
        for (const subgrupo of subgrupos) {
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
          
          // Convertir array de segmentos a integers
          const segmentosArray = subgrupo.segmentos_excluidos && Array.isArray(subgrupo.segmentos_excluidos) 
            ? subgrupo.segmentos_excluidos.map((seg: string) => parseInt(seg)).filter((seg: number) => !isNaN(seg))
            : []
          
          const subgrupoValues = [
            subgrupo.nombre,
            destinoCreado.id,
            subgrupo.nro_orden,
            segmentosArray
          ]
          
          const subgrupoResult = await client.query(createSubgrupoQuery, subgrupoValues)
          const subgrupoCreado = subgrupoResult.rows[0]
          
          // Buscar el ID del producto usando el código
          if (subgrupo.productos_ids && Array.isArray(subgrupo.productos_ids) && subgrupo.productos_ids.length > 0) {
            
            const findProductoQuery = `
              SELECT p.id, CONCAT(pn.operador, '/', pn.tour_id) as codigo_completo
              FROM productos p
              JOIN producto_newton pn ON p.cod_newton = pn.tour_id
              WHERE CONCAT(pn.operador, '/', pn.tour_id) = $1
              LIMIT 1
            `

            const insertRelacionQuery = `
              INSERT INTO subgrupos_prod (
                producto_id,
                subgrupo_cat_id,
                subgrupo_dst_id
              ) VALUES (
                $1, $2, $3
              );
            `

            for (const codigo_completo of subgrupo.productos_ids) {
              // Buscar el ID del producto usando el código "3/2500021"
              const productoResult = await client.query(findProductoQuery, [String(codigo_completo)])
              
              if (productoResult.rows.length === 0) {
                console.warn('⚠️ Producto no encontrado:', codigo_completo)
                continue
              }

              const producto = productoResult.rows[0]
              await client.query(insertRelacionQuery, [producto.id, null, subgrupoCreado.id])
            }
          }
        }
      }

      // NUEVA FUNCIÓN: Buscar producto por código antes de insertar
      const insertRelatedProducts = async (tableName: string, productosCodigos: string[] | undefined) => {
        if (!productosCodigos || !Array.isArray(productosCodigos) || productosCodigos.length === 0) return
        
        const findProductoQuery = `
          SELECT p.id, CONCAT(pn.operador, '/', pn.tour_id) as codigo_completo
          FROM productos p
          JOIN producto_newton pn ON p.cod_newton = pn.tour_id
          WHERE CONCAT(pn.operador, '/', pn.tour_id) = $1
          LIMIT 1
        `
        
        for (const codigo_completo of productosCodigos) {
          const productoResult = await client.query(findProductoQuery, [String(codigo_completo)])
          
          if (productoResult.rows.length === 0) {
            console.warn(`⚠️ Producto no encontrado en ${tableName}:`, codigo_completo)
            continue
          }

          const producto = productoResult.rows[0]
          
          await client.query(`
            INSERT INTO ${tableName} (destino_id, producto_id)
            VALUES ($1, $2)
          `, [destinoCreado.id, producto.id])
        }
      }

      // Insertar productos en las tablas especiales
      await insertRelatedProducts('mas_vendidos_dst', masVendidos)
      await insertRelatedProducts('vuelos_incluidos_dst', vueloIncluido)
      await insertRelatedProducts('recomendados_dst', recomendados)
      
      await client.query('COMMIT')
      return { success: true, message: 'Destino creado correctamente', destino: destinoCreado }
      
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error creando destino:', error)
    return { success: false, message: 'Error creando destino' }
  }
})
