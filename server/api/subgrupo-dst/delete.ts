import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)

    if (id === undefined) {
      return { success: false, message: 'ID del subgrupo es requerido' }
    }

    // Iniciar transacción
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // 1. Eliminar todas las relaciones en subgrupos_prod
      await client.query(`
        DELETE FROM subgrupos_prod 
        WHERE subgrupo_dst_id = $1
      `, [id])

      // 2. Eliminar el subgrupo de destino
      const deleteResult = await client.query(`
        DELETE FROM subgrupos_dst 
        WHERE id = $1
        RETURNING *
      `, [id])

      if (deleteResult.rows.length === 0) {
        await client.query('ROLLBACK')
        return { success: false, message: 'No se encontró el subgrupo para eliminar' }
      }

      await client.query('COMMIT')

      return { 
        success: true, 
        message: 'Subgrupo de destino eliminado correctamente',
        subgrupo: deleteResult.rows[0]
      }

    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Error eliminando subgrupo de destino:', error)
    return { success: false, message: 'Error eliminando subgrupo de destino' }
  }
})
