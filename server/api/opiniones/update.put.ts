import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
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
      id === undefined ||
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

    
    let estadoDb;    
    switch ((estado || "").toString().toLowerCase()) {
      case "activo":
        estadoDb = true;
        break;
      case "inactivo":
      case "borrado":
        estadoDb = false;
        break;
      default:
        estadoDb = false;
    }

    let destacadoDb;
    switch ((destacado || '').toString().toLowerCase()) {
      case 'activo':
        destacadoDb = true
        break
      case 'inactivo':
      case 'borrado':
        destacadoDb = false
        break
      default:
        destacadoDb = false
    }

    const query = `
      UPDATE "Opinion" SET
        nombre = $1,
        tour = $2,
        img = $3,
        rating = $4,
        comentario = $5,
        estado = $6,
        destacado = $7,
        "producto_Id" = $8,
        categoria_id = $9,
        destino_id = $10
      WHERE id = $11
      RETURNING *;
    `;

    const values = [
      nombre,
      tour,
      img,
      rating,
      comentario,
      estadoDb,
      destacadoDb,
      producto_Id,
      categoria_id,
      destino_id,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró la opinión para modificar' }
    }
    return { success: true, message: 'Opinión modificada correctamente', opinion: result.rows[0] }
  } catch (error) {
    console.error('Error modificando opinión:', error)
    return { success: false, message: 'Error modificando opinión' }
  }
})
