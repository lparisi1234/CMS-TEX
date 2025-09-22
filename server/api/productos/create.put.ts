import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  const pool = await getDbPool();
  const client = await pool.connect();
  
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
      itinerario
    } = await readBody(event)

    if (
      nombreprod === undefined ||
      cod_newton === undefined
    ) {
      return { success: false, message: 'Nombre del producto y código Newton son requeridos' }
    }

    await client.query('BEGIN');

    // Paso 1: Insertar en la tabla principal "productos"
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

    const result = await client.query(query, values);
    const productoId = result.rows[0].id;
    console.log("Segmentos Excluidos:", segmentos_excluidos);
    // Paso 2: Insertar en la tabla de unión "segmentos_productos"
    if (segmentos_excluidos && Array.isArray(segmentos_excluidos) && segmentos_excluidos.length > 0) {
      const querySegmentos = `
        INSERT INTO segmentos_productos (producto_id, segmentos_id) VALUES ($1, $2);
      `;
      for (const segmentoId of segmentos_excluidos) {
        await client.query(querySegmentos, [productoId, parseInt(segmentoId)]);
      }
    }

    // Paso 3: Insertar en la tabla "itinerario"
    if (itinerario && Array.isArray(itinerario) && itinerario.length > 0) {
      const queryItinerario = `
        INSERT INTO itinerario (producto_id, nro_dia, titulo, texto) VALUES ($1, $2, $3, $4);
      `;
      for (const item of itinerario) {
        await client.query(queryItinerario, [
          productoId, 
          item.nro_dia || 1, 
          item.titulo || '', 
          item.texto || ''
        ]);
      }
    }

    await client.query('COMMIT');

    return { 
      success: true, 
      message: 'Producto creado correctamente', 
      producto: { ...result.rows[0], segmentos_excluidos, itinerario } 
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creando producto:', error);
    return { success: false, message: 'Error creando producto' };
  } finally {
    client.release();
  }
})
