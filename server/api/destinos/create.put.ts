import getDbPool from "../../db"
export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      cod_newton,
      url,
      nombre,
      h1,
      h2,
      video_mobile,
      video_desktop,
      experto_id,
      consejo_experto,
      img,
      meta_titulo,
      meta_descripcion,
      meta_keywords,
      mapa,
      estado,
      nro_orden,
      precio_desde,
      region_id
    } = await readBody(event)

    if (
      cod_newton === undefined ||
      url === undefined ||
      nombre === undefined ||
      h1 === undefined ||
      h2 === undefined ||
      video_mobile === undefined ||
      video_desktop === undefined ||
      experto_id === undefined ||
      consejo_experto === undefined ||
      img === undefined ||
      meta_titulo === undefined ||
      meta_descripcion === undefined ||
      meta_keywords === undefined ||
      mapa === undefined ||
      estado === undefined ||
      nro_orden === undefined ||
      precio_desde === undefined ||
      region_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO "Destinos" (
        cod_newton,
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
        precio_desde,
        region_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      ) RETURNING *;
    `

    const values = [
      cod_newton,
      url,
      nombre,
      h1,
      h2,
      video_mobile,
      video_desktop,
      experto_id,
      consejo_experto,
      img,
      meta_titulo,
      meta_descripcion,
      meta_keywords,
      mapa,
      estado,
      nro_orden,
      precio_desde,
      region_id
    ]

    const result = await pool.query(query, values)
    return { success: true, message: 'Destino creado correctamente', destino: result.rows[0] }
  } catch (error) {
    console.error('Error creando destino:', error)
    return { success: false, message: 'Error creando destino' }
  }
})
