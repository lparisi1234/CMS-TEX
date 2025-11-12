import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      autor,
      img,
      fecha,
      estado,
      titulo,
      destacado_home,
      categoria_id,
      nro_orden,
      destino_id,
      url
    } = await readBody(event)

    if (
      id === undefined ||
      autor === undefined ||
      img === undefined ||
      fecha === undefined ||
      estado === undefined ||
      titulo === undefined ||
      url === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const oldResult = await pool.query('SELECT img FROM nota_blog WHERE id = $1', [id])
    const oldBlog = oldResult.rows[0]
    
    if (!oldBlog) {
      return { success: false, message: 'Blog no encontrado' }
    }

    const query = `
      UPDATE nota_blog SET
        autor = $1,
        img = $2,
        fecha = $3,
        estado = $4,
        titulo = $5,
        destacado_home = $6,
        categoria_id = $7,
        destino_id = $8,
        nro_orden = $9,
        url = $10
      WHERE id = $11
      RETURNING *;
    `;

    const values = [
      autor,
      img,
      fecha,
      estado,
      titulo,
      destacado_home,
      categoria_id === '' || categoria_id === undefined ? null : categoria_id,
      destino_id === '' || destino_id === undefined ? null : destino_id,
      nro_orden === '' || nro_orden === undefined ? null : nro_orden,
      url,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el blog para modificar' }
    }

    if (oldBlog.img && oldBlog.img !== img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: oldBlog.img }
        }) as { success: boolean }
        
        if (!deleteResponse.success) {
          console.warn('No se pudo eliminar la imagen anterior de S3:', oldBlog.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen anterior de S3:', error)
      }
    }

    return { success: true, message: 'Blog modificado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error modificando blog:', error)
    return { success: false, message: 'Error modificando blog' }
  }
})
