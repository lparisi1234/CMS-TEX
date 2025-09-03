import getDbPool from "../../db"
import { mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises'
import * as path from 'node:path'
import * as os from 'node:os'
import { exec as execCb } from 'node:child_process'
import { promisify } from 'node:util'
import { defineEventHandler, readBody } from 'h3'

const exec = promisify(execCb)

export default defineEventHandler(async (event) => {
    try {
    const pool = await getDbPool()
    const {
      descripcion,
      img: imgInput,
      url,
      estado
    } = await readBody(event)

    if (
      descripcion === undefined ||
      imgInput === undefined ||
      url === undefined ||
      estado === undefined
    ) {
      return { success: false, message: 'Faltan campos requeridos' }
    }

    // Subida a S3 vía CLI si recibimos data URL
    let img = imgInput
    try {
      if (typeof imgInput === 'string' && imgInput.startsWith('data:')) {
        const match = imgInput.match(/^data:(.*?);base64,(.*)$/)
        if (!match) throw new Error('Formato de imagen inválido')
        const contentType = match[1] || 'application/octet-stream'
        const base64Data = match[2]
        const buffer = Buffer.from(base64Data, 'base64')

        const region = process.env.AWS_REGION || 'us-east-1'
        const bucket = process.env.S3_BUCKET
        const basePath = process.env.S3_BASE_PATH || 'uploads'
        if (!bucket) throw new Error('S3_BUCKET no configurado')

        const ext = contentType.split('/')[1] || 'bin'
        const timestamp = Date.now()
        const random = Math.random().toString(36).slice(2, 8)
        const key = `${basePath}/${timestamp}-${random}.${ext}`

        const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'cms-tex-'))
        const tmpFile = path.join(tmpDir, `upload.${ext}`)
        try {
          await writeFile(tmpFile, buffer)
          const s3Uri = `s3://${bucket}/${key}`
          const cmd = `aws s3 cp "${tmpFile}" "${s3Uri}" --region ${region} --acl public-read`
          await exec(cmd)
          img = `https://${bucket}.s3.${region}.amazonaws.com/${key}`
        } finally {
          try { await unlink(tmpFile) } catch {}
          try { await rmdir(tmpDir) } catch {}
        }
      }
    } catch (e) {
      console.error('Error subiendo imagen a S3 con CLI:', e)
      return { success: false, message: 'Error subiendo imagen a S3' }
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