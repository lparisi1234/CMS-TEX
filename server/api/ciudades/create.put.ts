import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      cod_newton,
      imagen,
      guia,
      nombre,
      estado,
      destino_id
    } = await readBody(event)

    if (
      cod_newton === undefined ||
      imagen === undefined ||
      guia === undefined ||
      nombre === undefined ||
      estado === undefined ||
      destino_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const estadoDB = estado === "activo" ? true : false;

    const query = `
      INSERT INTO "Ciudades" (
        cod_newton,
        imagen,
        guia,
        nombre,
        estado,
        destino_id
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      cod_newton,
      imagen,
      guia,
      nombre,
      estadoDB,
      destino_id
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Ciudad creada correctamente', ciudad: result.rows[0] }
  } catch (error) {
    console.error('Error creando ciudad:', error)
    return { success: false, message: 'Error creando ciudad' }
  }
})
