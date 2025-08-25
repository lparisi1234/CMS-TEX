import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      nombreprod,
      h1,
      img,
      imagen_mobile,
      video_mapa_mobile,
      video_mapa_desktop,
      podcast,
      codigonewton,
      url,
      cantidad_estrellas,
      cantidadAport,
      consejo_experto,
      expertoId,
      meta_titulo,
      meta_descripcion,
      estado,
      sticker,
      duracion,
      iniciafinaliza,
      precio,
      precioTachado,
      salidas,
      aereo_incluido
    } = await readBody(event)

    if (
      nombreprod === undefined ||
      h1 === undefined ||
      img === undefined ||
      imagen_mobile === undefined ||
      video_mapa_mobile === undefined ||
      video_mapa_desktop === undefined ||
      podcast === undefined ||
      codigonewton === undefined ||
      url === undefined ||
      cantidad_estrellas === undefined ||
      cantidadAport === undefined ||
      consejo_experto === undefined ||
      expertoId === undefined ||
      meta_titulo === undefined ||
      meta_descripcion === undefined ||
      estado === undefined ||
      sticker === undefined ||
      duracion === undefined ||
      iniciafinaliza === undefined ||
      precio === undefined ||
      precioTachado === undefined ||
      salidas === undefined ||
      aereo_incluido === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const estadoDB = estado === "activo" ? true : false;
    const aereoIncluidoDB = aereo_incluido === "si" ? true : false;

    const query = `
      INSERT INTO "Producto" (
        nombreprod,
        h1,
        img,
        imagen_mobile,
        video_mapa_mobile,
        video_mapa_desktop,
        podcast,
        codigonewton,
        url,
        cantidad_estrellas,
        "cantidadAport",
        consejo_experto,
        "expertoId",
        meta_titulo,
        meta_descripcion,
        estado,
        sticker,
        duracion,
        iniciafinaliza,
        precio,
        "precioTachado",
        salidas,
        aereo_incluido
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING *;
    `;

    const values = [
      nombreprod,
      h1,
      img,
      imagen_mobile,
      video_mapa_mobile,
      video_mapa_desktop,
      podcast,
      codigonewton,
      url,
      cantidad_estrellas,
      cantidadAport,
      consejo_experto,
      expertoId,
      meta_titulo,
      meta_descripcion,
      estadoDB,
      sticker,
      duracion,
      iniciafinaliza,
      precio,
      precioTachado,
      salidas,
      aereoIncluidoDB
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Producto creado correctamente', producto: result.rows[0] }
  } catch (error) {
    console.error('Error creando producto:', error)
    return { success: false, message: 'Error creando producto' }
  }
})
