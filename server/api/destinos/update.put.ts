import { pool } from '../../db'

export default defineEventHandler(async (event) => {
  try {
    const {
      id,
      url,
      nombre,
      h1,
      h2,
      video_mobile,
      video_desktop,
      experto_id,
      consejo_experto,
      img,
      txt_search,
      meta_titulo,
      meta_descripcion,
      meta_keywords,
      mapa,
      estado,
      nro_orden,
      desde_precio
    } = await readBody(event)

    if (
      id === undefined ||
      url === undefined ||
      nombre === undefined ||
      h1 === undefined ||
      h2 === undefined ||
      video_mobile === undefined ||
      video_desktop === undefined ||
      experto_id === undefined ||
      consejo_experto === undefined ||
      img === undefined ||
      txt_search === undefined ||
      meta_titulo === undefined ||
      meta_descripcion === undefined ||
      meta_keywords === undefined ||
      mapa === undefined ||
      estado === undefined ||
      nro_orden === undefined ||
      desde_precio === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      UPDATE "Destinos" SET
        url = $1,
        nombre = $2,
        h1 = $3,
        h2 = $4,
        video_mobile = $5,
        video_desktop = $6,
        experto_id = $7,
        consejo_experto = $8,
        img = $9,
        txt_search = $10,
        meta_titulo = $11,
        meta_descripcion = $12,
        meta_keywords = $13,
        mapa = $14,
        estado = $15,
        nro_orden = $16,
        desde_precio = $17
      WHERE id = $18
      RETURNING *;
    `

    const values = [
      url,
      nombre,
      h1,
      h2,
      video_mobile,
      video_desktop,
      experto_id,
      consejo_experto,
      img,
      txt_search,
      meta_titulo,
      meta_descripcion,
      meta_keywords,
      mapa,
      estado,
      nro_orden,
      desde_precio,
      id
    ]

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el destino para modificar' }
    }
    return { success: true, message: 'Destino modificado correctamente', destino: result.rows[0] }
  } catch (error) {
    console.error('Error modificando destino:', error)
    return { success: false, message: 'Error modificando destino' }
  }
})
