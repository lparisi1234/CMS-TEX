import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  const pool = await getDbPool();
  
  try {
    const {
      id,
      nombreprod,
      h1,
      img,
      imagen_mobile,
      video_mapa_mobile,
      video_mapa_desktop,
      podcast,
      cod_newton,
      url,
      cantidad_estrellas,
      cantidadAport,
      consejo_experto,
      experto_id,
      meta_titulo,
      meta_descripcion,
      estado,
      sticker,
      salidas,
      aereo_incluido,
      segmentos_excluidos,
      secciones,
      itinerario
    } = await readBody(event)

    if (
      id === undefined ||
      nombreprod === undefined ||
      cod_newton === undefined
    ) {
      return { success: false, message: 'ID, nombre del producto y código Newton son requeridos' }
    }

    // Primero obtener las imágenes anteriores antes de actualizar
    const oldResult = await pool.query('SELECT img, imagen_mobile FROM productos WHERE id = $1', [id])
    const oldProducto = oldResult.rows[0]
    
    if (!oldProducto) {
      return { success: false, message: 'Producto no encontrado' }
    }

    await pool.query('BEGIN');

    const query = `
      UPDATE productos SET
        nombreprod = $1,
        h1 = $2,
        img = $3,
        imagen_mobile = $4,
        video_mapa_mobile = $5,
        video_mapa_desktop = $6,
        podcast = $7,
        cod_newton = $8,
        url = $9,
        cantidad_estrellas = $10,
        "cantidadAport" = $11,
        consejo_experto = $12,
        experto_id = $13,
        meta_titulo = $14,
        meta_descripcion = $15,
        estado = $16,
        sticker = $17,
        salidas = $18,
        aereo_incluido = $19
      WHERE id = $20
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
      cod_newton,
      url || '',
      cantidad_estrellas || 5,
      cantidadAport || 0,
      consejo_experto || '',
      experto_id || null,
      meta_titulo || '',
      meta_descripcion || '',
      estado,
      sticker || '',
      salidas || '',
      aereo_incluido,
      id
    ];

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return { success: false, message: 'No se encontró el producto para modificar' }
    }
    
    // Eliminar segmentos existentes y agregar los nuevos
    const queryDeleteSegmentos = `
      DELETE FROM segmentos_productos
      WHERE producto_id = $1;
    `;
    await pool.query(queryDeleteSegmentos, [id]);

    if (segmentos_excluidos && Array.isArray(segmentos_excluidos) && segmentos_excluidos.length > 0) {
      const queryInsertSegmentos = `
        INSERT INTO segmentos_productos (producto_id, segmentos_id) VALUES ($1, $2);
      `;
      for (const segmentoId of segmentos_excluidos) {
        await pool.query(queryInsertSegmentos, [id, parseInt(segmentoId)]);
      }
    }

    // Eliminar secciones existentes y agregar las nuevas
    const queryDeleteSecciones = `
      DELETE FROM secciones_prod
      WHERE product_id = $1;
    `;
    await pool.query(queryDeleteSecciones, [id]);

    // Si vienen secciones, puede ser un array o un solo objeto
    const seccionesArray = Array.isArray(secciones) ? secciones : (secciones ? [secciones] : []);
    
    if (seccionesArray.length > 0) {
      for (const seccion of seccionesArray) {
        if (seccion.seccion_id && seccion.segmentos_excluidos && Array.isArray(seccion.segmentos_excluidos) && seccion.segmentos_excluidos.length > 0) {
          // Convertir el array de strings a array de integers para PostgreSQL
          const segmentosArray = seccion.segmentos_excluidos.map((seg: any) => parseInt(seg));
          
          const querySeccionesProd = `
            INSERT INTO secciones_prod (seccion_id, producto_id, segmentos_id) 
            VALUES ($1, $2, $3);
          `;
          
          await pool.query(querySeccionesProd, [
            parseInt(seccion.seccion_id),
            id,
            segmentosArray  // PostgreSQL convertirá esto a un array {1,3,5}
          ]);
        }
      }
    }
/*
    // Eliminar itinerario existente y agregar el nuevo
    const queryDeleteItinerario = `
      DELETE FROM itinerario
      WHERE producto_id = $1;
    `;
    await client.query(queryDeleteItinerario, [id]);
*/
    if (itinerario && Array.isArray(itinerario) && itinerario.length > 0) {
      const queryInsertItinerario = `
        INSERT INTO itinerario (producto_id, nro_dia, titulo, texto) VALUES ($1, $2, $3, $4);
      `;
      for (const item of itinerario) {
        await pool.query(queryInsertItinerario, [
          id, 
          item.nro_dia || 1, 
          item.titulo || '', 
          item.texto || ''
        ]);
      }
    }

    await pool.query('COMMIT');

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

    // Eliminar las imágenes anteriores de S3 si son diferentes a las nuevas (después de la transacción)
    await Promise.all([
      oldProducto.img !== img ? deleteImageFromS3(oldProducto.img) : Promise.resolve(),
      oldProducto.imagen_mobile !== imagen_mobile ? deleteImageFromS3(oldProducto.imagen_mobile) : Promise.resolve()
    ])

    return { 
      success: true, 
      message: 'Producto modificado correctamente', 
      producto: { ...result.rows[0], segmentos_excluidos, itinerario } 
    }
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error modificando producto:', error)
    return { success: false, message: 'Error modificando producto' }
  } finally {
    // No need to release when using pool directly
  }
})
