import getDbPool from "../../db"

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const {
      id,
      cod_newton,
      imagen,
      guia,
      nombre,
      estado,
      destino_id
    } = await readBody(event)

    if (
      id === undefined ||
      cod_newton === undefined ||
      imagen === undefined ||
      guia === undefined ||
      nombre === undefined ||
      estado === undefined ||
      destino_id === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    let estadoDb;
    switch ((estado || '').toLowerCase()) {
      case 'activo':
        estadoDb = true
        break
      case 'inactivo':
      case 'borrado':
        estadoDb = false
        break
      default:
        estadoDb = false
    }

    const query = `
      UPDATE "Ciudades" SET
        cod_newton = $1,
        imagen = $2,
        guia = $3,
        nombre = $4,
        estado = $5,
        destino_id = $6
      WHERE id = $7
      RETURNING *;
    `;

    const values = [
      cod_newton,
      imagen,
      guia,
      nombre,
      estadoDb,
      destino_id,
      id
    ];

    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return { success: false, message: 'No se encontró la ciudad para modificar' }
    }
    return { success: true, message: 'Ciudad modificada correctamente', ciudad: result.rows[0] }
  } catch (error) {
    console.error('Error modificando ciudad:', error)
    return { success: false, message: 'Error modificando ciudad' }
  }
})
