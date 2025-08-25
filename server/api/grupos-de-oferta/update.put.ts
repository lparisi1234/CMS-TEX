import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
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

    const query = `
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
        segmentos_id = $12,
        descuento_id = $13
      WHERE id = $14
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
      estadoDb,
      segmentos_id,
      descuento_id,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el grupo de oferta para modificar' }
    }
    return { success: true, message: 'Grupo de oferta modificado correctamente', grupo: result.rows[0] }
  } catch (error) {
    console.error('Error modificando grupo de oferta:', error)
    return { success: false, message: 'Error modificando grupo de oferta' }
  }
})
