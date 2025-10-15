import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    const result = await pool.query('SELECT img FROM destinos WHERE id = $1', [id])
    const destino = result.rows[0]
    
    if (!destino) {
      return { success: false, message: 'Destino no encontrado' }
    }

    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      await client.query('UPDATE destinos SET region_id = NULL WHERE region_id = $1', [id])

      await client.query('DELETE FROM subgrupos_prod WHERE subgrupo_dst_id IN (SELECT id FROM subgrupos_dst WHERE destino_id = $1)', [id])
      await client.query('DELETE FROM subgrupos_dst WHERE destino_id = $1', [id])

      await client.query('DELETE FROM destinos WHERE id = $1', [id])

      await client.query('COMMIT')

      if (destino.img) {
        try {
          const deleteResponse = await $fetch('/api/delete-image', {
            method: 'POST',
            body: { imageUrl: destino.img }
          }) as { success: boolean }
          
          if (!deleteResponse.success) {
            console.warn('No se pudo eliminar la imagen de S3:', destino.img)
          }
        } catch (error) {
          console.warn('Error eliminando imagen de S3:', error)
        }
      }

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
