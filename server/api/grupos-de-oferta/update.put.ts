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

    // Primero obtener las imágenes anteriores antes de la transacción
    const oldResult = await pool.query('SELECT img_desktop, img_tablet, img_mobile FROM "GrupoDeOferta" WHERE id = $1', [id])
    const oldGrupoOferta = oldResult.rows[0]
    
    if (!oldGrupoOferta) {
      return { success: false, message: 'Grupo de oferta no encontrado' }
    }

     await client.query('BEGIN');



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
      estado,
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
      oldGrupoOferta.img_desktop !== img_desktop ? deleteImageFromS3(oldGrupoOferta.img_desktop) : Promise.resolve(),
      oldGrupoOferta.img_tablet !== img_tablet ? deleteImageFromS3(oldGrupoOferta.img_tablet) : Promise.resolve(),
      oldGrupoOferta.img_mobile !== img_mobile ? deleteImageFromS3(oldGrupoOferta.img_mobile) : Promise.resolve()
    ])

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
