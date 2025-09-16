import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      nombre,
      destino_id,
      nro_orden,
      productos_ids
    } = await readBody(event)

    if (
      nombre === undefined ||
      destino_id === undefined ||
      nro_orden === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    // Iniciar transacción
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // 1. Crear el subgrupo de destino
      const createSubgrupoQuery = `
        INSERT INTO subgrupos_dst (
          nombre,
          destino_id,
          nro_orden
        ) VALUES (
          $1, $2, $3
        ) RETURNING *;
      `

      const subgrupoValues = [nombre, destino_id, nro_orden]
      const subgrupoResult = await client.query(createSubgrupoQuery, subgrupoValues)
      const subgrupoCreado = subgrupoResult.rows[0]

      // 2. Si hay productos_ids, crear las relaciones en subgrupos_prod
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

        for (const producto_id of productos_ids) {
          await client.query(createRelacionQuery, [producto_id, null, subgrupoCreado.id])
        }
      }

      await client.query('COMMIT')

      return { 
        success: true, 
        message: 'Subgrupo de destino creado correctamente', 
        subgrupo: subgrupoCreado,
        productos_relacionados: productos_ids || []
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
