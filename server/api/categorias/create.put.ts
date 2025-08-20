import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      nombre,
      descripcion,
      h2,
      h1,
      meta_titulo,
      meta_descripcion,
      meta_keywords,
      icono,
      nro_orden,
      img_carousel,
      img_search,
      video_mobile,
      video_desktop,
      estado,
      codigo_newton,
      idExperto,
      consejo_experto,
      url
    } = await readBody(event)

    if (
      nombre === undefined ||
      descripcion === undefined ||
      h2 === undefined ||
      h1 === undefined ||
      meta_titulo === undefined ||
      meta_descripcion === undefined ||
      meta_keywords === undefined ||
      icono === undefined ||
      nro_orden === undefined ||
      img_carousel === undefined ||
      img_search === undefined ||
      video_mobile === undefined ||
      video_desktop === undefined ||
      estado === undefined ||
      codigo_newton === undefined ||
      idExperto === undefined ||
      consejo_experto === undefined ||
      url === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO "Categoria" (
        nombre,
        descripcion,
        h2,
        h1,
        meta_titulo,
        meta_descripcion,
        meta_keywords,
        icono,
        nro_orden,
        img_carousel,
        img_search,
        video_mobile,
        video_desktop,
        estado,
        codigo_newton,
        "idExperto",
        consejo_experto,
        url
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING *;
    `

    const values = [
      nombre,
      descripcion,
      h2,
      h1,
      meta_titulo,
      meta_descripcion,
      meta_keywords,
      icono,
      nro_orden,
      img_carousel,
      img_search,
      video_mobile,
      video_desktop,
      estado,
      codigo_newton,
      idExperto,
      consejo_experto,
      url
    ]

    const result = await pool.query(query, values)
    return { success: true, message: 'Categoría creada correctamente', categoria: result.rows[0] }
  } catch (error) {
    console.error('Error creando categoría:', error)
    return { success: false, message: 'Error creando categoría' }
  }
})
