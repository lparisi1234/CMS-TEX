import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
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
      estado,
      segmentos_id,
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
      segmentos_id === undefined ||
      descuento_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const estadoDB = estado === "activo" ? true : false;

    const query = `
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
        segmentos_id,
        descuento_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;

    const values = [
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
      estadoDB,
      segmentos_id,
      descuento_id
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Grupo de oferta creado correctamente', grupo: result.rows[0] }
  } catch (error) {
    console.error('Error creando grupo de oferta:', error)
    return { success: false, message: 'Error creando grupo de oferta' }
  }
})
