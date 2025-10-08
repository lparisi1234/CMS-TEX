// import {
//   SecretsManagerClient,
//   GetSecretValueCommand,
// } from "@aws-sdk/client-secrets-manager";
// import { Pool } from "pg"; // Asegúrate de importar Pool

// const secret_name = "rds!cluster-006274a9-499c-42fd-8ee4-16da7a66ab2a";
// const client = new SecretsManagerClient({
//   region: "us-east-1",
// });


// // Función para obtener el secret de AWS
// async function getSecret() {
//   try {
//     const response = await client.send(
//       new GetSecretValueCommand({
//         SecretId: secret_name,
//         VersionStage: "AWSCURRENT",
//       })
//     );

//     // Parsear el JSON del secret
//     const secret = JSON.parse(response.SecretString);


//     return secret;
//   } catch (error) {
//     console.error("Error obteniendo el secret:", error);
//     throw error;
//   }
// }

// let pool;

// // Función para crear el pool de conexiones
// async function getDbPool() {
//   if (!pool) {
//     try {
//       // Obtener las credenciales del secret
//       const credentials = await getSecret();

//       // Asegurar que la contraseña sea un string
//       const password = String(credentials.password || credentials.pass || '');
//       const username = String(credentials.username || credentials.user || 'postgres');

//       if (!password) {
//         throw new Error('No se encontró la contraseña en el secret');
//       }

//       pool = new Pool({
//         host: "tex2-dev.cluster-c0lq6suu44up.us-east-1.rds.amazonaws.com",
//         user: username,
//         password: password,
//         database: "DB_TEX",
//         port: 5432,
//         max: 10,
//         idleTimeoutMillis: 30000,
//         connectionTimeoutMillis: 2000,
//       });
//     } catch (error) {
//       console.error("Error creando el pool de conexiones:", error);
//       throw error;
//     }
//   }
//   return pool;
// }

// export default getDbPool;


// ///FUNCIONA DE FORMA LOCAL

 import { Pool } from 'pg';

 let pool;

 async function getDbPool() {
   if (!pool) {
     pool = new Pool({
       host: "localhost",
       user: "postgres",
       password: "ADMIN",
       database: "TourExperto",
      max: 10,
       idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
   });
  }
  return pool;
}

 export default getDbPool;


// host: "localhost",
// user: "postgres",
// password: "Lioben2000!#",
// database: "TEX_v2",

// host: "localhost",
// user: "postgres",
// password: "root",
// database: "dbtest",
