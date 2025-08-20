import getDbPool from "~/server/db" 

export default defineEventHandler(async (event) => {
  try {
    const {
      autor,
      img,
      fecha,
      estado,
      titulo,
      destacado_home,
      categoria_id,
      paises_id,
      region_id
    } = await readBody(event)

    if (
      autor === undefined ||
      img === undefined ||
      fecha === undefined ||
      estado === undefined ||
      titulo === undefined ||
      destacado_home === undefined ||
      categoria_id === undefined ||
      paises_id === undefined ||
      region_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO "NotaBlog" (
        autor,
        img,
        fecha,
        estado,
        titulo,
        destacado_home,
        categoria_id,
        paises_id,
        region_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      autor,
      img,
      fecha,
      estado,
      titulo,
      destacado_home,
      categoria_id,
      paises_id,
      region_id
    ];

    const pool = await getDbPool();
    const result = await pool.query(query, values)
    return { success: true, message: 'Blog creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando blog:', error)
    return { success: false, message: 'Error creando blog' }
  }
})
