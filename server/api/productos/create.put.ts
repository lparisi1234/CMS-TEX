import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  const pool = await getDbPool();
  
  try {
    const {
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
      secciones
    } = await readBody(event)

    if (
      nombreprod === undefined ||
      cod_newton === undefined
    ) {
      return { success: false, message: 'Nombre del producto y código Newton son requeridos' }
    }

    await pool.query('BEGIN');

    const query = `
      INSERT INTO productos (
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
        "cantidadAport",
        consejo_experto,
        experto_id,
        meta_titulo,
        meta_descripcion,
        estado,
        sticker,
        salidas,
        aereo_incluido
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
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
      aereo_incluido
    ];

    const result = await pool.query(query, values);
    const productoId = result.rows[0].id;
    
    if (segmentos_excluidos && Array.isArray(segmentos_excluidos) && segmentos_excluidos.length > 0) {
      const querySegmentos = `
        INSERT INTO segmentos_productos (producto_id, segmentos_id) VALUES ($1, $2);
      `;
      for (const segmentoId of segmentos_excluidos) {
        await pool.query(querySegmentos, [productoId, parseInt(segmentoId)]);
      }
    }

    const seccionesArray = Array.isArray(secciones) ? secciones : (secciones ? [secciones] : []);
    
    if (seccionesArray.length > 0) {
      const querySeccionesProd = `
        INSERT INTO secciones_prod (seccion_id, producto_id, segmentos_id) 
        VALUES ($1, $2, $3);
      `;
      
      for (const seccion of seccionesArray) {
        if (seccion.seccion_id && seccion.segmentos_excluidos && Array.isArray(seccion.segmentos_excluidos) && seccion.segmentos_excluidos.length > 0) {
          const segmentosArray = seccion.segmentos_excluidos.map((seg: any) => parseInt(seg));
          
          await pool.query(querySeccionesProd, [
            parseInt(seccion.seccion_id),
            productoId,
            segmentosArray
          ]);
        }
      }
    }

    await pool.query('COMMIT');

    return { 
      success: true, 
      message: 'Producto creado correctamente',
      id: productoId,
      producto: { ...result.rows[0], segmentos_excluidos } 
    };
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creando producto:', error);
    return { success: false, message: 'Error creando producto' };
  }
})
