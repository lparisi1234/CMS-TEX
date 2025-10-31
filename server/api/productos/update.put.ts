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

    let codNewtonFinal = cod_newton;
    let operadorId: number | null = null;

    if (typeof cod_newton === 'string' && cod_newton.includes('/')) {
      const [operador, codigo] = cod_newton.split('/');
      if (operador && codigo) {
        operadorId = parseInt(operador);
        codNewtonFinal = codigo;
      }
    }

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
      codNewtonFinal,
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

    const queryDeleteSecciones = `
      DELETE FROM secciones_prod
      WHERE producto_id = $1;
    `;
    await pool.query(queryDeleteSecciones, [id]);

    const seccionesArray = Array.isArray(secciones) ? secciones : (secciones ? [secciones] : []);
console.log('Secciones Array:', seccionesArray);  
    if (seccionesArray.length > 0) {
      for (const seccion of seccionesArray) {
       
          const segmentosArray = seccion.segmentos_excluidos.map((seg: any) => parseInt(seg));

          const querySeccionesProd = `
            INSERT INTO secciones_prod (seccion_id, producto_id, segmentos_id) 
            VALUES ($1, $2, $3);
          `;

          await pool.query(querySeccionesProd, [
            parseInt(seccion.seccion_id),
            id,
            segmentosArray
          ]);
        
      }
    }

    // Eliminar itinerario existente y agregar el nuevo
    const queryDeleteItinerario = `
      DELETE FROM itinerario
      WHERE producto_id = $1;
    `;
    await pool.query(queryDeleteItinerario, [id]);

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

    const deleteImageFromS3 = async (imageUrl: string) => {
      if (!imageUrl) return

      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl }
        }) as { success: boolean }

        if (!deleteResponse.success) {
          console.warn('No se pudo eliminar la imagen anterior de S3:', imageUrl)
        }
      } catch (error) {
        console.warn('Error eliminando imagen anterior de S3:', error)
      }
    }

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
  }
})
