import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    const { imageUrl } = await readBody(event)

    if (!imageUrl) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Ruta de imagen requerida'
      })
    }

    // Ya no necesitamos parsear la URL completa
    const bucketName = 'tex2-static-images-prd'
    const s3Key = imageUrl // Ahora imageUrl es directamente el s3Key (ej: "categorias/imagen.jpg")

    const s3Path = `s3://${bucketName}/${s3Key}`

    const command = `aws s3 rm "${s3Path}"`

    const { stdout, stderr } = await execAsync(command)

    if (stderr && !stderr.includes('delete:')) {
      console.error('Error en AWS CLI:', stderr)
      throw createError({
        statusCode: 500,
        statusMessage: `Error al eliminar de S3: ${stderr}`
      })
    }

    return {
      success: true,
      message: 'Imagen eliminada de S3 exitosamente',
      deletedPath: s3Path,
      stdout: stdout
    }

  } catch (error) {
    console.error('Error eliminando imagen de S3:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error eliminando imagen de S3'
    })
  }
})