import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      nombreprod,
      h1,
      img,
      imagen_mobile,
      video_mapa_mobile,
      video_mapa_desktop,
      podcast,
      codigonewton,
      url,
      cantidad_estrellas,
      cantidadAport,
      consejo_experto,
      expertoId,
      meta_titulo,
      meta_descripcion,
      estado,
      sticker,
      duracion,
      iniciafinaliza,
      precio,
      precioTachado,
      salidas,
      aereo_incluido
    } = await readBody(event)

    if (
      id === undefined ||
      nombreprod === undefined ||
      codigonewton === undefined
    ) {
      return { success: false, message: 'ID, nombre del producto y código Newton son requeridos' }
    }

    // Primero obtener las imágenes anteriores antes de actualizar
    const oldResult = await pool.query('SELECT img, imagen_mobile FROM "Producto" WHERE id = $1', [id])
    const oldProducto = oldResult.rows[0]
    
    if (!oldProducto) {
      return { success: false, message: 'Producto no encontrado' }
    }




    const query = `
      UPDATE "Producto" SET
        nombreprod = $1,
        h1 = $2,
        img = $3,
        imagen_mobile = $4,
        video_mapa_mobile = $5,
        video_mapa_desktop = $6,
        podcast = $7,
        codigonewton = $8,
        url = $9,
        cantidad_estrellas = $10,
        "cantidadAport" = $11,
        consejo_experto = $12,
        "expertoId" = $13,
        meta_titulo = $14,
        meta_descripcion = $15,
        estado = $16,
        sticker = $17,
        duracion = $18,
        iniciafinaliza = $19,
        precio = $20,
        "precioTachado" = $21,
        salidas = $22,
        aereo_incluido = $23
      WHERE id = $24
      RETURNING *;
    `;

    const values = [
      nombreprod || '',
      h1 || '',
      img || '',
      imagen_mobile || '',
      video_mapa_mobile || '',
      video_mapa_desktop || '',
      podcast || '',
      codigonewton,
      url || '',
      cantidad_estrellas || 5,
      cantidadAport || 0,
      consejo_experto || '',
      expertoId || null,
      meta_titulo || '',
      meta_descripcion || '',
      estado,
      sticker || '',
      duracion || '',
      iniciafinaliza || '',
      precio || 0,
      precioTachado || 0,
      salidas || '',
      aereo_incluido,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el producto para modificar' }
    }

    // Función auxiliar para eliminar imagen de S3
    const deleteImageFromS3 = async (imageUrl: string) => {
      if (!imageUrl) return
      
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl }
        }) as { success: boolean }
        
        if (deleteResponse.success) {
          console.log('Imagen anterior eliminada de S3:', imageUrl)
        } else {
          console.warn('No se pudo eliminar la imagen anterior de S3:', imageUrl)
        }
      } catch (error) {
        console.warn('Error eliminando imagen anterior de S3:', error)
      }
    }

    // Eliminar las imágenes anteriores de S3 si son diferentes a las nuevas
    await Promise.all([
      oldProducto.img !== img ? deleteImageFromS3(oldProducto.img) : Promise.resolve(),
      oldProducto.imagen_mobile !== imagen_mobile ? deleteImageFromS3(oldProducto.imagen_mobile) : Promise.resolve()
    ])

    return { success: true, message: 'Producto modificado correctamente', producto: result.rows[0] }
  } catch (error) {
    console.error('Error modificando producto:', error)
    return { success: false, message: 'Error modificando producto' }
  }
})
