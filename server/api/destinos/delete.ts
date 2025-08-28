import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    // Iniciar transacción
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // Eliminar dependencias: actualizar destinos que usan esta región
      await client.query('UPDATE "Destinos" SET region_id = NULL WHERE region_id = $1', [id])

      // Eliminar subgrupos relacionados y sus productos
      await client.query('DELETE FROM "SubGrupo_prod" WHERE subgrupo_dst_id IN (SELECT id FROM "Subgrupos_dst" WHERE destino_id = $1)', [id])
      await client.query('DELETE FROM "Subgrupos_dst" WHERE destino_id = $1', [id])

      // Eliminar el destino
      await client.query('DELETE FROM "Destinos" WHERE id = $1', [id])

      await client.query('COMMIT')
      return { success: true, message: 'Destino eliminado correctamente' }

    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Error eliminando destino:', error)
    return { success: false, message: 'Error eliminando destino' }
  }
})
