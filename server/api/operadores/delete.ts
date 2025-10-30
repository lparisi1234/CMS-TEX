import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const { id } = await readBody(event)
    if (!id) {
      return { success: false, message: 'ID requerido' }
    }

    const result = await pool.query('SELECT img FROM operador WHERE id = $1', [id])
    const operador = result.rows[0]
    
    if (!operador) {
      return { success: false, message: 'Operador no encontrado' }
    }

    // Iniciar transacción
    await pool.query('BEGIN')

    try {
      // Eliminar primero los segmentos excluidos asociados
      await pool.query('DELETE FROM operadores_segmentos WHERE operador_id = $1', [id])

      // Luego eliminar el operador
      await pool.query('DELETE FROM operador WHERE id = $1', [id])

      // Confirmar transacción
      await pool.query('COMMIT')

      // Eliminar imagen de S3 (fuera de la transacción)
      if (operador.img) {
        try {
          const deleteResponse = await $fetch('/api/delete-image', {
            method: 'POST',
            body: { imageUrl: operador.img }
          }) as { success: boolean }
          
          if (!deleteResponse.success) {
            console.warn('No se pudo eliminar la imagen de S3:', operador.img)
          }
        } catch (error) {
          console.warn('Error eliminando imagen de S3:', error)
        }
      }

      return { success: true, message: 'Operador eliminado correctamente' }
    } catch (error) {
      // Revertir transacción en caso de error
      await pool.query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('Error eliminando Operador:', error)
    return { success: false, message: 'Error eliminando Operador' }
  }
})