import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
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
      id === undefined ||
      nombreprod === undefined ||
      codigonewton === undefined
    ) {
      return { success: false, message: 'ID, nombre del producto y código Newton son requeridos' }
    }

    let estadoDb;
    switch ((estado || '').toLowerCase()) {
      case 'activo':
        estadoDb = true
        break
      case 'inactivo':
      case 'borrador':
        estadoDb = false
        break
      default:
        estadoDb = false
    }

    let aereoIncluidoDb;
    switch ((aereo_incluido || '').toLowerCase()) {
      case 'si':
        aereoIncluidoDb = true
        break
      case 'no':
        aereoIncluidoDb = false
        break
      default:
        aereoIncluidoDb = false
    }

    const query = `
      UPDATE "Producto" SET
        nombreprod = $1,
        h1 = $2,
        img = $3,
        imagen_mobile = $4,
        video_mapa_mobile = $5,
        video_mapa_desktop = $6,
        podcast = $7,
        codigonewton = $8,
        url = $9,
        cantidad_estrellas = $10,
        "cantidadAport" = $11,
        consejo_experto = $12,
        "expertoId" = $13,
        meta_titulo = $14,
        meta_descripcion = $15,
        estado = $16,
        sticker = $17,
        duracion = $18,
        iniciafinaliza = $19,
        precio = $20,
        "precioTachado" = $21,
        salidas = $22,
        aereo_incluido = $23
      WHERE id = $24
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
      codigonewton,
      url || '',
      cantidad_estrellas || 5,
      cantidadAport || 0,
      consejo_experto || '',
      expertoId || null,
      meta_titulo || '',
      meta_descripcion || '',
      estadoDb,
      sticker || '',
      duracion || '',
      iniciafinaliza || '',
      precio || 0,
      precioTachado || 0,
      salidas || '',
      aereoIncluidoDb,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el producto para modificar' }
    }
    return { success: true, message: 'Producto modificado correctamente', producto: result.rows[0] }
  } catch (error) {
    console.error('Error modificando producto:', error)
    return { success: false, message: 'Error modificando producto' }
  }
})
