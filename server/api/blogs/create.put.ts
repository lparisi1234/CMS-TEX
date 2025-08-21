import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      autor,
      img,
      fecha,
      estado,
      titulo,
      destacado_home,
      categoria_id,
      destino_id
    } = await readBody(event)

    
    if (
      autor === undefined ||
      img === undefined ||
      fecha === undefined ||
      estado === undefined ||
      titulo === undefined ||
      destacado_home === undefined ||
      categoria_id === undefined ||
      destino_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    
    const estadoDB = estado === "activo" ? true : false;

    const query = `
      INSERT INTO "NotaBlog" (
        autor,
        img,
        fecha,
        estado,
        titulo,
        destacado_home,
        categoria_id,
        destino_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      autor,
      img,
      fecha,
      estadoDB,
      titulo,
      destacado_home,
      categoria_id,
      destino_id,
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Blog creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando blog:', error)
    return { success: false, message: 'Error creando blog' }
  }
})