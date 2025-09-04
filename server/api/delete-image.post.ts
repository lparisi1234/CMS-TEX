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

    // Extraer la ruta S3 de la URL (maneja URLs con y sin región)
    // URL con región: https://tex2-static-images-prd.s3.us-east-1.amazonaws.com/carpeta/archivo.jpg
    // URL sin región: https://tex2-static-images-prd.s3.amazonaws.com/carpeta/archivo.jpg
    let bucketName, s3Key

    // Patrón para URLs con región: bucket.s3.region.amazonaws.com
    const regionalPattern = /https:\/\/([^.]+)\.s3\.([^.]+)\.amazonaws\.com\/(.+)/
    // Patrón para URLs sin región: bucket.s3.amazonaws.com  
    const standardPattern = /https:\/\/([^.]+)\.s3\.amazonaws\.com\/(.+)/

    const regionalMatch = imageUrl.match(regionalPattern)
    const standardMatch = imageUrl.match(standardPattern)

    if (regionalMatch) {
      bucketName = regionalMatch[1]
      s3Key = regionalMatch[3]
    } else if (standardMatch) {
      bucketName = standardMatch[1] 
      s3Key = standardMatch[2]
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL de imagen inválida'
      })
    }

    const s3Path = `s3://${bucketName}/${s3Key}`

    // Comando AWS S3 RM
    const command = `aws s3 rm "${s3Path}"`

    console.log('Ejecutando comando:', command)
    console.log('Bucket:', bucketName)
    console.log('Key:', s3Key)

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