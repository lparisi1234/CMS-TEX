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
      producto_Id,
      categoria_id,
      destino_id
    } = await readBody(event)

    if (
      nombre === undefined ||
      tour === undefined ||
      img === undefined ||
      rating === undefined ||
      comentario === undefined ||
      estado === undefined ||
      destacado === undefined ||
      producto_Id === undefined ||
      categoria_id === undefined ||
      destino_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }



    const query = `
      INSERT INTO "Opinion" (
        nombre,
        tour,
        img,
        rating,
        comentario,
        estado,
        destacado,
        "producto_Id",
        categoria_id,
        destino_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [
      nombre,
      tour,
      img,
      rating,
      comentario,
      estado,
      destacado,
      producto_Id,
      categoria_id,
      destino_id
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Opinión creada correctamente', opinion: result.rows[0] }
  } catch (error) {
    console.error('Error creando opinión:', error)
    return { success: false, message: 'Error creando opinión' }
  }
})
