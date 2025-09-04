import getDbPool from "../../db"
import { readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
    try {
    const pool = await getDbPool()

    const formData = await readMultipartFormData(event)

    let descripcion, img, estado, url; 
    if (formData) {
      for (const field of formData) {
        if (field.name === 'descripcion') {
          descripcion = field.data.toString('utf8');
        } else if (field.name === 'img') {
          img = field.data.toString('utf8');
        } else if (field.name === 'estado') {
          estado = field.data.toString('utf8');
        } else if (field.name === 'url') {
          url = field.data.toString('utf8');
        }
      }
    }

    // Validar que los campos existan
    if (!descripcion || !img || !estado) {
      // Ahora validamos solo los campos necesarios
      return { success: false, message: 'Faltan campos requeridos' }
    }

    const query = `
      INSERT INTO "NotaDePrensa" (
        descripcion,
        img,
        url,
        estado
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
     descripcion,
      img,
      url,
      estado
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Nota de Prensa creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando Nota de Prensa:', error)
    return { success: false, message: 'Error creando Nota de Prensa' }
  }
})