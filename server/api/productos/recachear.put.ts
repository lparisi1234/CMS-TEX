import getDbPool from "../../db"

/**
 * Convierte un texto en un slug URL-friendly
 * Ejemplo: "Europa Turista 3" -> "europa-turista-3"
 */
function generateSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Reemplazar caracteres especiales y acentos
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Reemplazar espacios y caracteres no alfanuméricos con guiones
    .replace(/[^a-z0-9]+/g, '-')
    // Eliminar guiones múltiples
    .replace(/-+/g, '-')
    // Eliminar guiones al inicio y final
    .replace(/^-+|-+$/g, '');
}

/**
 * Genera las URLs para un tour
 * @param {string} tourName - Nombre del tour
 * @param {string} gdsProviderId - ID del proveedor GDS
 * @param {string} tourId - ID del tour
 * @returns {object} { urlSeo, urlById, uniqueId }
 */
function generateTourUrls(tourName: string, gdsProviderId: number, tourId: string) {
  const slug = generateSlug(tourName);
  const uniqueId = `${gdsProviderId}/${tourId}`;  // ID único compuesto
  
  return {
    urlSeo: `${slug}-${uniqueId}`,           // URL visible: europa-turista-3-123-1234
    urlById: `${uniqueId}`,                   // URL alternativa: 123-1234
    uniqueId: uniqueId                        // Para referencia
  };
}

export default defineEventHandler(async (event) => {
  const pool = await getDbPool();
  
  try {
    const { cod_newton } = await readBody(event);

    if (!cod_newton) {
      return { success: false, message: 'Código Newton es requerido' };
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

    await pool.query('BEGIN');
    // Verificar que el producto existe
    const checkProductoNewton = await pool.query(
      'SELECT * FROM producto_newton WHERE tour_id = $1 AND operador = $2',
      [codNewtonFinal, operadorId]
    );

    if (checkProductoNewton.rows.length === 0) {
      await pool.query('ROLLBACK');
      return { 
        success: false, 
        message: 'Producto Newton no encontrado en la base de datos' 
      };
    }

    // Obtener datos actualizados de la API
    const apiUrl = `https://preprod.vietur.com.ar/api/api-tour/${cod_newton}?token=6ff20176e662661d5f1577bc9b3e02fa&currency=USD&simplified=1`;
        
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      
      const updateResult = await pool.query(
        'UPDATE productos SET estado = $1 WHERE cod_newton = $2',
        [false, codNewtonFinal]
      );
            
      await pool.query('COMMIT');

      
      return { 
        success: false, 
        message: `Error al obtener información del producto Newton: ${response.statusText}`,
        estado: false,
        rowsUpdated: updateResult.rowCount
      };
    }
    
    // Si la respuesta es exitosa, actualizar el estado a true
    await pool.query(
      'UPDATE productos SET estado = true WHERE cod_newton = $1',
      [codNewtonFinal]
    );

    const productoNewtonData = await response.json();
    
    // Procesar itinerario para obtener ciudades
    const itinerary = productoNewtonData.data.itinerary || [];
    let startCity = null;
    let endCity = null;

    if (itinerary.length > 0) {
      const firstDay = itinerary[0];
      if (firstDay.cities && firstDay.cities.length > 0) {
        startCity = firstDay.cities[0].id;
      }

      const lastDay = itinerary[itinerary.length - 1];
      if (lastDay.cities && lastDay.cities.length > 0) {
        endCity = lastDay.cities[lastDay.cities.length - 1].id;
      }
    }

    // Obtener imagen aleatoria
    const allImages = productoNewtonData.data.allImages || [];
    let randomImageUrl = null;
    if (allImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * allImages.length);
      randomImageUrl = allImages[randomIndex].url;
    }

    // ========================================
    // GENERAR URLs SEO CON ID ÚNICO COMPUESTO
    // ========================================
    const { urlSeo, urlById, uniqueId } = generateTourUrls(
      productoNewtonData.data.name, 
      operadorId!, 
      codNewtonFinal
    );
    console.log(`URLs generadas - Unique ID: ${uniqueId} | SEO: ${urlSeo} | Por ID: ${urlById}`);

    // Actualizar producto_newton (sin actualizar main_image)
    const updateProductoNewton = `
      UPDATE producto_newton SET
        name = $1,
        duration_days = $2,
        duration_nights = $3,
        date_from = $4,
        date_untill = $5,
        price_from = $6,
        price_from_original = $7,
        moneda = $8,
        featured = $9,
        recomended = $10,
        start_city = $11,
        end_city = $12,
        departure_month = $13,
        included = $14,
        not_included = $15,
        observations = $16
      WHERE tour_id = $17 AND operador = $18
      RETURNING *;
    `;

    await pool.query(updateProductoNewton, [
      productoNewtonData.data.name || '',
      productoNewtonData.data.durationDays || null,
      productoNewtonData.data.durationNights || null,
      productoNewtonData.data.firstDeparture || null,
      productoNewtonData.data.lastDeparture || null,
      productoNewtonData.data.priceFrom.amount || null,
      productoNewtonData.data.priceFrom.amountOriginal || null,
      productoNewtonData.data.currency.code || null,
      productoNewtonData.data.featured || false,
      productoNewtonData.data.recommended || false,
      startCity,
      endCity,
      productoNewtonData.data.firstDeparture || null,
      productoNewtonData.data.included || '',
      productoNewtonData.data.not_included || '',
      productoNewtonData.data.observations || '',
      codNewtonFinal,
      operadorId
    ]);

    // Eliminar y recrear itinerario
    await pool.query('DELETE FROM itinerario_newton WHERE producto_id = $1', [codNewtonFinal]);

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
        const ciudadesNombres = dia.cities && dia.cities.length > 0 
          ? dia.cities
              .map((city: any) => {
                const nombre = city.name || '';
                return nombre
                  .toLowerCase()
                  .split(' ')
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
              })
              .join(', ')
          : '';

        await pool.query(insertItinerario, [
          codNewtonFinal,
          dia.day,
          ciudadesNombres,
          dia.description || ''
        ]);
      }
    }

    // Eliminar y recrear ciudades del tour
    await pool.query('DELETE FROM ciudades_tour WHERE tour_id = $1', [codNewtonFinal]);

    const citiesData = productoNewtonData.data.cities || [];
    const cities = Array.isArray(citiesData) ? citiesData : Object.values(citiesData);

    const insertCiudadTour = `
      INSERT INTO ciudades_tour (tour_id, ciudades_newton_id) 
      VALUES ($1, $2)
    `;

    for (const city of cities) {
      if (city.id) {
        const ciudadExiste = await pool.query(
          'SELECT id FROM ciudades WHERE cod_newton = $1',
          [city.id]
        );
        
        if (ciudadExiste.rows.length > 0) {
          await pool.query(insertCiudadTour, [codNewtonFinal, city.id]);
        }
      }
    }
    
    // ========================================
    // INSERTAR/ACTUALIZAR PRODUCTOS CON URLs (sin actualizar imagen_mobile en UPDATE)
    // ========================================
    const upsertProducto = `
      INSERT INTO productos (cod_newton, nombreprod, url, url_alternativa, imagen_mobile, estado)
      VALUES ($1, $2, $3, $4, $5, true)
      ON CONFLICT (cod_newton) DO UPDATE SET
        nombreprod = EXCLUDED.nombreprod,
        url = EXCLUDED.url,
        url_alternativa = EXCLUDED.url_alternativa,
        estado = true
      RETURNING *;
    `;

    const updateResult = await pool.query(upsertProducto, [
      codNewtonFinal,
      productoNewtonData.data.name || '',
      urlSeo,
      urlById,
      randomImageUrl  // Solo se usa en INSERT, no en UPDATE
    ]);
    
    await pool.query('COMMIT');

    return { 
      success: true, 
      message: 'Producto Newton recacheado correctamente',
      cod_newton: codNewtonFinal,
      estado: true,
      url: urlSeo,
      url_alternativa: urlById,
      rowsUpdated: updateResult.rowCount
    };

  } catch (error) {
    console.error('===== ERROR EN RECACHEO =====');
    console.error('Error:', error);
    await pool.query('ROLLBACK');
    return { success: false, message: 'Error recacheando producto Newton'};
  }
});