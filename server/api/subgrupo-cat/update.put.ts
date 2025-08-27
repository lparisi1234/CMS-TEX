import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      nombre,
      categoria_id,
      nro_orden,
      productos_ids
    } = await readBody(event)

    if (
      id === undefined ||
      nombre === undefined ||
      categoria_id === undefined ||
      nro_orden === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    // Iniciar transacción
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // 1. Actualizar el subgrupo de categoría
      const updateSubgrupoQuery = `
        UPDATE "Subgrupos_cat" SET
          nombre = $1,
          categoria_id = $2,
          nro_orden = $3
        WHERE id = $4
        RETURNING *;
      `

      const subgrupoValues = [nombre, categoria_id, nro_orden, id]
      const subgrupoResult = await client.query(updateSubgrupoQuery, subgrupoValues)
      
      if (subgrupoResult.rows.length === 0) {
        await client.query('ROLLBACK')
        return { success: false, message: 'No se encontró el subgrupo de categoría para modificar' }
      }

      const subgrupoActualizado = subgrupoResult.rows[0]

      // 2. Eliminar todas las relaciones existentes para este subgrupo
      await client.query(`
        DELETE FROM "SubGrupo_prod" 
        WHERE subgrupo_cat_id = $1
      `, [id])

      // 3. Si hay productos_ids, crear las nuevas relaciones en subgrupos_prod
      if (productos_ids && productos_ids.length > 0) {
        const createRelacionQuery = `
          INSERT INTO "Subgrupos_prod" (
            producto_id,
            subgrupo_cat_id,
            subgrupo_dst_id
          ) VALUES (
            $1, $2, $3
          );
        `

        for (const producto_id of productos_ids) {
          await client.query(createRelacionQuery, [producto_id, id, null])
        }
      }

      await client.query('COMMIT')

      return { 
        success: true, 
        message: 'Subgrupo de categoría modificado correctamente', 
        subgrupo: subgrupoActualizado,
        productos_relacionados: productos_ids || []
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
