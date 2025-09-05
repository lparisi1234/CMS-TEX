import getDbPool from "../../db"


export default defineEventHandler(async (event) => {
  const pool = await getDbPool()
  const client = await pool.connect();
  try {
    const pool = await getDbPool()
    const client = await pool.connect();
    const {
      descripcion,
      titulo,
      subtitulo,
      segundaDescripcion,
      img_desktop,
      img_tablet,
      img_mobile,
      hasta_fecha,
      nro_orden,
      url,
      segmentos_id,
      estado,
      descuento_id
    } = await readBody(event)

    if (
      descripcion === undefined ||
      titulo === undefined ||
      subtitulo === undefined ||
      segundaDescripcion === undefined ||
      img_desktop === undefined ||
      img_tablet === undefined ||
      img_mobile === undefined ||
      hasta_fecha === undefined ||
      nro_orden === undefined ||
      url === undefined ||
      estado === undefined ||
      descuento_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    await client.query('BEGIN');


    const queryGrupoOferta = `
      INSERT INTO "GrupoDeOferta" (
        descripcion,
        titulo,
        subtitulo,
        "segundaDescripcion",
        img_desktop,
        img_tablet,
        img_mobile,
        hasta_fecha,
        nro_orden,
        url,
        estado,
        descuento_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;

    const resultadoGrupoOferta = await client.query(queryGrupoOferta, [
      descripcion,
      titulo,
      subtitulo,
      segundaDescripcion,
      img_desktop,
      img_tablet,
      img_mobile,
      hasta_fecha,
      nro_orden,
      url,
      estado,
      descuento_id     
    ])

    const grupodeOfertaId = resultadoGrupoOferta.rows[0].id;

     // Paso 2: Insertar en la tabla de unión "DestinoHomeSegmentos"
    if (segmentos_id && Array.isArray(segmentos_id) && segmentos_id.length > 0) {
      const querySegmentos = `
        INSERT INTO "GrupoDeOferta_Segmento" (grupodeoferta_id, segmento_id) VALUES ($1, $2);
      `;
      for (const segmentoId of segmentos_id) {
        await client.query(querySegmentos, [grupodeOfertaId, parseInt(segmentoId)]);
      }
    }

    await client.query('COMMIT');

    return {
      success: true,
      message: 'Grupo de oferta creado correctamente',
      destino: { id: grupodeOfertaId, descripcion, titulo, subtitulo, segundaDescripcion, img_desktop, img_tablet, img_mobile, hasta_fecha, nro_orden, url, estado,
       descuento_id, segmentos_id }
    };
  }catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creando Grupo de oferta:', error);
    return { success: false, message: 'Error creando Grupo de oferta' };
  } finally {
    client.release();
  } 
})
