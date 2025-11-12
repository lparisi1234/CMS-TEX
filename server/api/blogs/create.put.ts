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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [
      autor,
      img,
      fecha,
      estadoDB,
      titulo,
      destacado_home,
      categoria_id === '' || categoria_id === undefined ? null : categoria_id,
      destino_id === '' || destino_id === undefined ? null : destino_id,
      nro_orden === '' || nro_orden === undefined ? null : nro_orden,
      url
    ];

    console.log('Valores a insertar:', values)
    
    const result = await pool.query(query, values)
    
    console.log('Resultado de la inserción:', result.rows[0])
    
    return { success: true, message: 'Blog creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando blog:', error)
    console.error('Stack trace completo:', error instanceof Error ? error.stack : 'No stack trace available')
    return { success: false, message: 'Error creando blog', error: error instanceof Error ? error.message : String(error) }
  }
})