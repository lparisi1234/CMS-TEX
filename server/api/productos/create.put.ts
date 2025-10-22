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

    // Separar el cod_newton del formato "operador_id/cod_newton" (ej: "3/5532")
    let codNewtonFinal = cod_newton;
    let operadorId: number | null = null;

    if (typeof cod_newton === 'string' && cod_newton.includes('/')) {
      const [operador, codigo] = cod_newton.split('/');
      if (operador && codigo) {
        operadorId = parseInt(operador);
        codNewtonFinal = codigo;
      }
    }

    await pool.query('BEGIN');

    // Verificar si existe en producto_newton usando tour_id y operador separados
    const checkProductoNewton = await pool.query(
      'SELECT * FROM producto_newton WHERE tour_id = $1 AND operador = $2',
      [codNewtonFinal, operadorId]
    );

    
    let productoNewtonData = null;

    // Si no existe en producto_newton, hacer fetch a la API
    if (checkProductoNewton.rows.length === 0) {
      try {
        const apiUrl = `https://preprod.vietur.com.ar/api/api-tour/${cod_newton}?token=6ff20176e662661d5f1577bc9b3e02fa&currency=USD&simplified=1`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          await pool.query('ROLLBACK');
          return { 
            success: false, 
            message: `Error al obtener información del producto Newton: ${response.statusText}` 
          };
        }

        productoNewtonData = await response.json();

        // Insertar en producto_newton con todos los campos de la API
        const insertProductoNewton = `
          INSERT INTO producto_newton (
            tour_id,
            name,
            duration_days,
            duration_nights,
            date_from,
            date_untill,
            price_from,
            price_from_original,
            moneda,
            operador,
            featured,
            recomended,
            main_image,
            start_city,
            end_city,
            departure_month,
            included
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          RETURNING *;
        `;
        
        // Extraer primera y última ciudad del itinerario
        const itinerary = productoNewtonData.data.itinerary || [];
        
        let startCity = null;
        let endCity = null;

        if (itinerary.length > 0) {
          // Obtener la primera ciudad del primer día
          const firstDay = itinerary[0];
          if (firstDay.cities && firstDay.cities.length > 0) {
            startCity = firstDay.cities[0].id;
          }

          // Obtener la última ciudad del último día
          const lastDay = itinerary[itinerary.length - 1];
          if (lastDay.cities && lastDay.cities.length > 0) {
            endCity = lastDay.cities[lastDay.cities.length - 1].id;
          }
        }

        await pool.query(insertProductoNewton, [
          codNewtonFinal,
          productoNewtonData.data.name || '',
          productoNewtonData.data.durationDays || null,
          productoNewtonData.data.durationNights || null,
          productoNewtonData.data.firstDeparture || null,
          productoNewtonData.data.lastDeparture || null,
          productoNewtonData.data.priceFrom.newAmount || null,
          productoNewtonData.data.priceFrom.amountOriginal || null,
          productoNewtonData.data.currency.code || null,
          operadorId,
          productoNewtonData.data.featured || false,
          productoNewtonData.data.recommended || false,
          productoNewtonData.data.allImages[0].url || null,
          startCity,
          endCity,
          productoNewtonData.data.firstDeparture || null,
          productoNewtonData.data.included || ''
        ]);

        

      } catch (fetchError) {
        await pool.query('ROLLBACK');
        console.error('Error al hacer fetch de producto Newton:', fetchError);
        return { 
          success: false, 
          message: 'Error al obtener información del producto Newton desde la API' 
        };
      }
    } else {
      
    }

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

      try {
        const itinerary = productoNewtonData.data.itinerary || [];
        // Convertir cities a array si viene como objeto
        const citiesData = productoNewtonData.data.cities || [];
        const cities = Array.isArray(citiesData) ? citiesData : Object.values(citiesData);

        // Insertar itinerarios en itinerario_newton
        if (itinerary.length > 0) {
          const insertItinerario = `
            INSERT INTO itinerario_newton (
              producto_id,
              nro_dia,
              titulo,
              texto
            ) VALUES ($1, $2, $3, $4);
          `;

          for (const dia of itinerary) {
            // Crear el título con los nombres de las ciudades
            const ciudadesNombres = dia.cities && dia.cities.length > 0 
              ? dia.cities.map((city: any) => city.name).join(' , ')
              : '';

            await pool.query(insertItinerario, [
              codNewtonFinal,
              dia.day,
              ciudadesNombres,
              dia.description || ''
            ]);
          }
        }

      
          const insertCiudadTour = `
            INSERT INTO ciudades_tour (tour_id, ciudades_newton_id) 
            VALUES ($1, $2)
          `;

          for (const city of cities) {
            console.log('Insertando ciudad para tour:', codNewtonFinal, city.id);
            if (city.id) {
              await pool.query(insertCiudadTour, [codNewtonFinal, city.id]);
            }
          }
        
      } catch (error) {
        console.error('Error insertando itinerarios y ciudades:', error);
        // No hacemos rollback aquí porque el producto principal ya se creó
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
