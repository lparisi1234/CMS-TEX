import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  const pool = await getDbPool();
  const client = await pool.connect();
  
  try {
    const {
      destino_id,
      segmentos_id, 
      nro_orden,
      precio_desde,
      img
    } = await readBody(event);

    if (
      destino_id === undefined ||
      nro_orden === undefined ||
      precio_desde === undefined ||
      img === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' };
    }

    await client.query('BEGIN');

    // Paso 1: Insertar en la tabla principal "DestinoHome"
    const queryDestino = `
      INSERT INTO "DestinoHome" (
        destino_id,
        nro_orden,
        precio_desde,
        img
      ) VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const resultDestino = await client.query(queryDestino, [
      destino_id,
      nro_orden,
      precio_desde,
      img
    ]);
    const destinoHomeId = resultDestino.rows[0].id;

    // Paso 2: Insertar en la tabla de unión "DestinoHomeSegmentos"
    if (segmentos_id && Array.isArray(segmentos_id) && segmentos_id.length > 0) {
      const querySegmentos = `
        INSERT INTO "DestinoHomeSegmentos" (destino_home_id, segmento_id) VALUES ($1, $2);
      `;
      for (const segmentoId of segmentos_id) {
        await client.query(querySegmentos, [destinoHomeId, parseInt(segmentoId)]);
      }
    }

    await client.query('COMMIT');

    return {
      success: true,
      message: 'Destino destacado creado correctamente',
      destino: { id: destinoHomeId, destino_id, nro_orden, precio_desde, img, segmentos_id }
    };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creando destino destacado:', error);
    return { success: false, message: 'Error creando destino destacado' };
  } finally {
    client.release();
  }
});