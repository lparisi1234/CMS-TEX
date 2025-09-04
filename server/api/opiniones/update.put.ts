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

    // Primero obtener la imagen anterior antes de actualizar
    const oldResult = await pool.query('SELECT img FROM "Opinion" WHERE id = $1', [id])
    const oldOpinion = oldResult.rows[0]
    
    if (!oldOpinion) {
      return { success: false, message: 'Opinión no encontrada' }
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

    // Eliminar la imagen anterior de S3 si es diferente a la nueva
    if (oldOpinion.img && oldOpinion.img !== img) {
      try {
        const deleteResponse = await $fetch('/api/delete-image', {
          method: 'POST',
          body: { imageUrl: oldOpinion.img }
        }) as { success: boolean }
        
        if (deleteResponse.success) {
          console.log('Imagen anterior eliminada de S3:', oldOpinion.img)
        } else {
          console.warn('No se pudo eliminar la imagen anterior de S3:', oldOpinion.img)
        }
      } catch (error) {
        console.warn('Error eliminando imagen anterior de S3:', error)
      }
    }

    return { success: true, message: 'Opinión modificada correctamente', opinion: result.rows[0] }
  } catch (error) {
    console.error('Error modificando opinión:', error)
    return { success: false, message: 'Error modificando opinión' }
  }
})
