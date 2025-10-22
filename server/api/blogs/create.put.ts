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
      nro_orden,
      destino_id,
      url
    } = await readBody(event)

    if (
      !autor ||
      !img ||
      !fecha ||
      estado === undefined ||
      !titulo ||
      destacado_home === undefined ||
      !destino_id ||
      !url
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    
    const estadoDB = estado === true ? true : false;

    const query = `
      INSERT INTO nota_blog (
        autor,
        img,
        fecha,
        estado,
        titulo,
        destacado_home,
        categoria_id,
        destino_id,
        nro_orden,
        url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)
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
      nro_orden,
      url
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Blog creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando blog:', error)
    return { success: false, message: 'Error creando blog' }
  }
})