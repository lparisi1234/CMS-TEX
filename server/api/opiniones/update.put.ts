import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      nombre,
      tour,
      img,
      rating,
      comentario,
      estado,
      destacado,
      producto_id,
      categoria_id,
      destino_id,
      generico
    } = await readBody(event)

    if (
      id === undefined ||
      nombre === undefined ||
      tour === undefined ||
      rating === undefined ||
      comentario === undefined ||
      estado === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    // Función para convertir valores vacíos a null
    const parseIntOrNull = (value: any) => {
      if (value === '' || value === null || value === undefined) return null
      const parsed = parseInt(value)
      return isNaN(parsed) ? null : parsed
    }

    const parseBooleanOrNull = (value: any) => {
      if (value === '' || value === null || value === undefined) return null
      return Boolean(value)
    }

    const oldResult = await pool.query('SELECT img FROM opinion WHERE id = $1', [id])
    const oldOpinion = oldResult.rows[0]

    if (!oldOpinion) {
      return { success: false, message: 'Opinión no encontrada' }
    }

    const query = `
      UPDATE opinion SET
        nombre = $1,
        tour = $2,
        img = $3,
        rating = $4,
        comentario = $5,
        estado = $6,
        destacado = $7,
        producto_id = $8,
        categoria_id = $9,
        destino_id = $10,
        generico = $11
      WHERE id = $12
      RETURNING *;
    `;
    
    const values = [
      nombre,
      tour,
      img || null,
      parseInt(rating),
      comentario,
      Boolean(estado),
      parseBooleanOrNull(destacado),
      parseIntOrNull(producto_id),
      parseIntOrNull(categoria_id),
      parseIntOrNull(destino_id),
      parseBooleanOrNull(generico),
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró la opinión para modificar' }
    }

    if (oldOpinion.img && oldOpinion.img !== img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: oldOpinion.img }
        }) as { success: boolean }

        if (!deleteResponse.success) {
          console.warn('No se pudo eliminar la imagen anterior de S3:', oldOpinion.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen anterior de S3:', error)
      }
    }

    return { success: true, message: 'Opinión modificada correctamente', opinion: result.rows[0] }
  } catch (error) {
    console.error('Error modificando opinión:', error)
    return { success: false, message: 'Error modificando opinión' }
  }
})
