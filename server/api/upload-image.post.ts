import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

const execAsync = promisify(exec)

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    const formData = await readMultipartFormData(event)
    const imageFile = formData?.find(field => field.name === 'image')
    const targetFolderField = formData?.find(field => field.name === 'targetFolder');

    if (!imageFile || !targetFolderField || !targetFolderField.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No se encontró archivo de imagen'
      })
    }

    const targetFolder = targetFolderField.data.toString('utf-8');

    // Usar el nombre original del archivo
    const fileName = imageFile.filename || 'default.jpg'
    const tempFilePath = join(tmpdir(), fileName)

    // Guardar archivo temporalmente
    await writeFile(tempFilePath, imageFile.data)

    // Comando AWS S3 CP
    const bucketName = 'tex2-static-images-prd'
    const s3Key = `${targetFolder}/${fileName}`;
    const s3Url = `s3://${bucketName}/${s3Key}`
    
    const command = `aws s3 cp "${tempFilePath}" "s3://${bucketName}/${s3Key}"`

    console.log('Ejecutando comando:', command)

    // Ejecutar comando AWS CLI
    const { stdout, stderr } = await execAsync(command)

    // Limpiar archivo temporal
    await unlink(tempFilePath).catch(console.error)

    if (stderr && !stderr.includes('upload:')) {
      console.error('Error en AWS CLI:', stderr)
      throw createError({
        statusCode: 500,
        statusMessage: `Error al subir a S3: ${stderr}`
      })
    }

    console.log('AWS CLI output:', stdout)
    
    const objectUrl = `https://${bucketName}.s3.us-east-1.amazonaws.com/${s3Key}`

    return {
      success: true,
      message: 'Imagen subida exitosamente',
      s3Url: objectUrl,
      fileName: fileName,
      stdout: stdout
    }

  } catch (error) {
    const typedError = error as { statusCode?: number; statusMessage?: string };
    console.error('Error en upload-image:', error)
    
    throw createError({
      statusCode: typedError.statusCode || 500,
      statusMessage: typedError.statusMessage || 'Error interno del servidor'
    })
  }
})