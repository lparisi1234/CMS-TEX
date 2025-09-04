import getDbPool from "../../db"
import { readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const pool = await getDbPool()
    const formData = await readMultipartFormData(event)

    let autor, img, fecha, estado, titulo, destacado_home, categoria_id, destino_id;

     if (formData) {
      for (const field of formData) {
        if (field.name === 'autor') {
          autor = field.data.toString('utf8');
        } else if (field.name === 'img') {
          img = field.data.toString('utf8');
        } else if (field.name === 'fecha') {
          fecha = field.data.toString('utf8');
        } else if (field.name === 'estado') {
          estado = field.data.toString('utf8');
        } else if (field.name === 'titulo') {
          titulo = field.data.toString('utf8');
        } else if (field.name === 'destacado_home') {
          destacado_home = field.data.toString('utf8');
        } else if (field.name === 'categoria_id') {
          categoria_id = field.data.toString('utf8');
        } else if (field.name === 'destino_id') {
          destino_id = field.data.toString('utf8');
        }
      }
    }

    
    if (
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

    
    const estadoDB = estado === "activo" ? true : false;

    const query = `
      INSERT INTO "NotaBlog" (
        autor,
        img,
        fecha,
        estado,
        titulo,
        destacado_home,
        categoria_id,
        destino_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      autor,
      img,
      fecha,
      estadoDB,
      titulo,
      destacado_home,
      categoria_id,
      destino_id,
    ];

    const result = await pool.query(query, values)
    return { success: true, message: 'Blog creado correctamente', blog: result.rows[0] }
  } catch (error) {
    console.error('Error creando blog:', error)
    return { success: false, message: 'Error creando blog' }
  }
})