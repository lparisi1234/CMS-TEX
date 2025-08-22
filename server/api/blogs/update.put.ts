import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
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
      id === undefined ||
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

    let estadoDb;
    switch ((estado || '').toLowerCase()) {
      case 'activo':
      case 'inactivo':
      case 'borrado':
      default:
        estadoDb = false
    }

    const query = `
      UPDATE "NotaBlog" SET
        autor = $1,
        img = $2,
        fecha = $3,
        estado = $4,
        titulo = $5,
        destacado_home = $6,
        categoria_id = $7,
        destino_id = $8
      WHERE id = $9
      RETURNING *;
    `;

    const values = [
      autor,
      img,
      fecha,
      estadoDb,
      titulo,
      destacado_home,
      categoria_id,
      destino_id,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró el blog para modificar' }
    }
    return { success: true, message: 'Blog modificado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error modificando blog:', error)
    return { success: false, message: 'Error modificando blog' }
  }
})
