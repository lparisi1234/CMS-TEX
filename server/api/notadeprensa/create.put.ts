import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
    try {
    const pool = await getDbPool()

    const { descripcion, img, estado, url, nro_orden, img_prensa} = await readBody(event)

    if (
      descripcion === undefined || 
      img === undefined || 
      estado === undefined || 
      url === undefined || 
      nro_orden === undefined || 
      img_prensa === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO nota_prensa (
        descripcion,
        img,
        url,
        estado,
        nro_orden,
        img_prensa
      ) VALUES ($1, $2, $3, $4, $5,$6)
      RETURNING *;
    `;

    const values = [
     descripcion,
      img,
      url,
      estado,
      nro_orden,
      img_prensa
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Nota de Prensa creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando Nota de Prensa:', error)
    return { success: false, message: 'Error creando Nota de Prensa' }
  }
})