import { pool } from '../../db'

export default defineEventHandler(async (event) => {
  try {
    const {
      id,
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
      id === undefined ||
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
      UPDATE "Categoria" SET
        nombre = $1,
        descripcion = $2,
        h2 = $3,
        h1 = $4,
        meta_titulo = $5,
        meta_descripcion = $6,
        meta_keywords = $7,
        icono = $8,
        nro_orden = $9,
        img_carousel = $10,
        img_search = $11,
        video_mobile = $12,
        video_desktop = $13,
        estado = $14,
        codigo_newton = $15,
        "idExperto" = $16,
        consejo_experto = $17,
        url = $18
      WHERE id = $19
      RETURNING *;
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
      url,
      id
    ]

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró la categoría para modificar' }
    }
    return { success: true, message: 'Categoría modificada correctamente', categoria: result.rows[0] }
  } catch (error) {
    console.error('Error modificando categoría:', error)
    return { success: false, message: 'Error modificando categoría' }
  }
})
