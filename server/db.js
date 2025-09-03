import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { Pool } from "pg"; // Asegúrate de importar Pool

const secret_name = "rds!cluster-006274a9-499c-42fd-8ee4-16da7a66ab2a";
const client = new SecretsManagerClient({
  region: "us-east-1",
});

// Función para obtener el secret de AWS
async function getSecret() {
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT",
      })
    );

    // Parsear el JSON del secret
    const secret = JSON.parse(response.SecretString);


    return secret;
  } catch (error) {
    console.error("Error obteniendo el secret:", error);
    throw error;
  }
}

// Función para crear el pool de conexiones
async function getDbPool() {
  try {
    // Obtener las credenciales del secret
    const credentials = await getSecret();

    // Asegurar que la contraseña sea un string
    const password = String(credentials.password || credentials.pass || '');
    const username = String(credentials.username || credentials.user || 'postgres');

    if (!password) {
      throw new Error('No se encontró la contraseña en el secret');
    }


    const pool = new Pool({
      host: "tex2-dev.cluster-c0lq6suu44up.us-east-1.rds.amazonaws.com",
      user: username,
      password: password,
      database: "TEX_db",
      port: 5432,
    });

    return pool;
  } catch (error) {
    console.error("Error creando el pool de conexiones:", error);
    throw error;
  }
}

export default getDbPool;



///FUNCIONA DE FORMA LOCAL

// import { Pool } from 'pg';

// async function getDbPool() {
//   const pool = new Pool({
//     host: "localhost",
//     user: "postgres",
//     password: "Lioben2000!#",
//     database: "TEX_db",
//   });
//   return pool;
// }

// export default getDbPool;


// host: "localhost",
// user: "postgres",
// password: "Lioben2000!#",
// database: "TEX_db",

// host: "localhost",
// user: "postgres",
// password: "root",
// database: "dbtest",
