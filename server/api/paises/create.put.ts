import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      nombre,
      numero_telefono,
      img,
      pais_apertura,
      segmentos_id
    } = await readBody(event)

    if (
      nombre === undefined ||
      numero_telefono === undefined ||
      img === undefined ||
      pais_apertura === undefined ||
      segmentos_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO paises_operativos (
        nombre,
        numero_telefono,
        img,
        pais_apertura,
        segmentos_id
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      nombre,
      numero_telefono,
      img,
      pais_apertura,
      segmentos_id
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'País creado correctamente', pais: result.rows[0] }
  } catch (error) {
    console.error('Error creando país:', error)
    return { success: false, message: 'Error creando país' }
  }
})
