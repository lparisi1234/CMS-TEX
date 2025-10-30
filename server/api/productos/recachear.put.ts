import getDbPool from "../../db"

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
      await pool.query('ROLLBACK');
      return { 
        success: false, 
        message: `Error al obtener información del producto Newton: ${response.statusText}` 
      };
    }

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

    // Actualizar producto_newton
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
        main_image = $11,
        start_city = $12,
        end_city = $13,
        departure_month = $14,
        included = $15,
        not_included = $16,
        observations = $17
      WHERE tour_id = $18 AND operador = $19
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
      randomImageUrl,
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

    await pool.query('COMMIT');

    return { 
      success: true, 
      message: 'Producto Newton recacheado correctamente',
      cod_newton: codNewtonFinal
    };

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error recacheando producto Newton:', error);
    return { success: false, message: 'Error recacheando producto Newton' };
  }
});