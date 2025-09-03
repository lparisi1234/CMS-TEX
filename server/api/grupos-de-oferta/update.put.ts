import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  const pool = await getDbPool()
  const client = await pool.connect()

  try {
      const {
      id,
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
      segmentos_id,
      descuento_id
    } = await readBody(event)

    if (
      id === undefined ||
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
      segmentos_id === undefined ||
      descuento_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

     await client.query('BEGIN');

    let estadoDb;
    switch ((estado || '').toString().toLowerCase()) {
      case 'activo':
        estadoDb = true
        break
      case 'inactivo':
      case 'borrado':
        estadoDb = false
        break
      default:
        estadoDb = false
    }

    const queryGrupoOferta = `
      UPDATE "GrupoDeOferta" SET
        descripcion = $1,
        titulo = $2,
        subtitulo = $3,
        "segundaDescripcion" = $4,
        img_desktop = $5,
        img_tablet = $6,
        img_mobile = $7,
        hasta_fecha = $8,
        nro_orden = $9,
        url = $10,
        estado = $11,
        descuento_id = $12
      WHERE id = $13
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
      estadoDb,
      descuento_id,
      id
    ]);

    if (resultadoGrupoOferta.rows.length === 0) {
      await client.query('ROLLBACK');
      return { success: false, message: 'El registro no se encontró.' };
    }

    const queryDeleteSegmentos = `
      DELETE FROM "GrupoDeOferta_Segmento"
      WHERE grupodeoferta_id = $1;
    `;
    await client.query(queryDeleteSegmentos, [id]);

    if (segmentos_id && Array.isArray(segmentos_id) && segmentos_id.length > 0) {
      const queryInsertSegmentos = `
        INSERT INTO "GrupoDeOferta_Segmento" (grupodeoferta_id, segmento_id) VALUES ($1, $2);
      `;
      for (const segmentoId of segmentos_id) {
        await client.query(queryInsertSegmentos, [id, parseInt(segmentoId)]);
      }
    }

    await client.query('COMMIT');

    return {
      success: true,
      message: 'Grupo de oferta actualizado correctamente.',
      destino: { ...resultadoGrupoOferta.rows[0], segmentos_id }
    };

  } catch (error) {
    await client.query('ROLLBACK'); // Deshacer los cambios en caso de error
    console.error('Error actualizando grupo de oferta:', error);
    return { success: false, message: 'Error actualizando grupo de oferta.' };
  } finally {
    client.release();
  }
})
