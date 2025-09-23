import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      cod_newton,
      img,
      guia,
      nombre,
      estado,
      destino_id,
      iata
    } = await readBody(event)

    if (
      cod_newton === undefined ||
      nombre === undefined ||
      estado === undefined ||
      destino_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }


    const query = `
      INSERT INTO ciudades (
        cod_newton,
        img,
        guia,
        nombre,
        estado,
        destino_id,
        iata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      cod_newton,
      img,
      guia,
      nombre,
      estado,
      destino_id,
      iata
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Ciudad creada correctamente', ciudad: result.rows[0] }
  } catch (error) {
    console.error('Error creando ciudad:', error)
    return { success: false, message: 'Error creando ciudad' }
  }
})
