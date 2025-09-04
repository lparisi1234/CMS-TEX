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
        statusMessage: 'URL de imagen requerida'
      })
    }

    // Extraer la ruta S3 de la URL
    // URL: https://tex2-static-images-prd.s3.amazonaws.com/carpeta/archivo.jpg
    // Ruta S3: s3://tex2-static-images-prd/carpeta/archivo.jpg
    const urlParts = imageUrl.split('.s3.amazonaws.com/')
    if (urlParts.length !== 2) {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL de imagen inválida'
      })
    }

    const bucketName = 'tex2-static-images-prd'
    const s3Key = urlParts[1]
    const s3Path = `s3://${bucketName}/${s3Key}`

    // Comando AWS S3 RM
    const command = `aws s3 rm "${s3Path}"`

    console.log('Ejecutando comando:', command)

    // Ejecutar comando AWS CLI
    const { stdout, stderr } = await execAsync(command)

    if (stderr && !stderr.includes('delete:')) {
      console.error('Error en AWS CLI:', stderr)
      throw createError({
        statusCode: 500,
        statusMessage: `Error al eliminar de S3: ${stderr}`
      })
    }

    console.log('AWS CLI output:', stdout)

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