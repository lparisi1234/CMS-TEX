import getDbPool from "../../db"
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

const execAsync = promisify(exec)

export default defineEventHandler(async (event) => {
    try {
        const pool = await getDbPool()
        
        // Leer datos del formulario multipart
        const formData = await readMultipartFormData(event)
        
        // Extraer campos del formulario
        const descripcion = formData?.find(field => field.name === 'descripcion')?.data?.toString()
        const url = formData?.find(field => field.name === 'url')?.data?.toString()
        const estado = formData?.find(field => field.name === 'estado')?.data?.toString()
        const imageFile = formData?.find(field => field.name === 'img')

        // Validar campos requeridos
        if (!descripcion || !url || !estado) {
            return { success: false, message: 'Faltan campos requeridos' }
        }

        let s3ImageUrl = null

        // Si hay imagen, subirla a S3
        if (imageFile && imageFile.data) {
            try {
                // Generar nombre único para el archivo
                const fileExtension = imageFile.filename?.split('.').pop() || 'jpg'
                const uniqueFileName = `${randomUUID()}.${fileExtension}`
                const tempFilePath = join('/tmp', uniqueFileName)

                // Guardar archivo temporalmente
                await writeFile(tempFilePath, imageFile.data)

                // Comando AWS S3 CP
                const bucketName = 'tex2-static-images-prd'
                const s3Key = `notas-de-prensa/imagen/${uniqueFileName}`
                s3ImageUrl = `s3://${bucketName}/${s3Key}`
                
                const command = `aws s3 cp "${tempFilePath}" "${s3ImageUrl}"`

                console.log('Subiendo imagen a S3:', command)

                // Ejecutar comando AWS CLI
                const { stdout, stderr } = await execAsync(command)

                // Limpiar archivo temporal
                await unlink(tempFilePath).catch(console.error)

                if (stderr && !stderr.includes('upload:')) {
                    console.error('Error en AWS CLI:', stderr)
                    return { success: false, message: `Error al subir imagen: ${stderr}` }
                }

                console.log('Imagen subida exitosamente:', stdout)

            } catch (uploadError) {
                console.error('Error subiendo imagen:', uploadError)
                return { success: false, message: 'Error al subir la imagen' }
            }
        }

        // Insertar en base de datos
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
            s3ImageUrl, // URL de S3 o null si no hay imagen
            url,
            estado
        ];

        const result = await pool.query(query, values)
        
        return { 
            success: true, 
            message: 'Nota de Prensa creada correctamente', 
            nota: result.rows[0],
            imageUrl: s3ImageUrl
        }

    } catch (error) {
        console.error('Error creando Nota de Prensa:', error)
        return { success: false, message: 'Error creando Nota de Prensa' }
    }
})