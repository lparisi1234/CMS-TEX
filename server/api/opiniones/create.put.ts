import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      nombre,
      tour,
      img,
      rating,
      comentario,
      estado,
      destacado,
      producto_id,
      categoria_id,
      destino_id,
      generico
    } = await readBody(event)

    // Solo validar campos requeridos
    if (
      nombre === undefined ||
      tour === undefined ||
      rating === undefined ||
      comentario === undefined ||
      estado === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    // Función para convertir valores vacíos a null
    const parseIntOrNull = (value: any) => {
      if (value === '' || value === null || value === undefined) return null
      const parsed = parseInt(value)
      return isNaN(parsed) ? null : parsed
    }

    const parseBooleanOrNull = (value: any) => {
      if (value === '' || value === null || value === undefined) return null
      return Boolean(value)
    }

    const query = `
      INSERT INTO opinion (
        nombre,
        tour,
        img,
        rating,
        comentario,
        estado,
        destacado,
        producto_id,
        categoria_id,
        destino_id,
        generico
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const values = [
      nombre,
      tour,
      img || null,
      parseInt(rating),
      comentario,
      Boolean(estado),
      parseBooleanOrNull(destacado),
      parseIntOrNull(producto_id),
      parseIntOrNull(categoria_id),
      parseIntOrNull(destino_id),
      parseBooleanOrNull(generico)
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Opinión creada correctamente', opinion: result.rows[0] }
  } catch (error) {
    console.error('Error creando opinión:', error)
    return { success: false, message: 'Error creando opinión' }
  }
})
