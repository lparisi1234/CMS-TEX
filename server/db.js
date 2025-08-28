import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { Pool } from 'pg';

const secretName = "rds!cluster-006274a9-499c-42fd-8ee4-16da7a66ab2a";
const region = 'us-east-1';

const secretsClient = new SecretsManagerClient({ region });

async function getDbPool() {
  // command = new GetSecretValueCommand({ SecretId: secretName });
  //const response = await secretsClient.send(command);
  //const secret = JSON.parse(response.SecretString);

  const pool = new Pool({
    host: "tex2-dev.cluster-c0lq6suu44up.us-east-1.rds.amazonaws.com",
    user: "postgres",
    password: "86!<JXUYcTOwEm*$u30X3WYXV*]7",
    database: "testdb",
    port: 5432,
  });

  return pool;
}

export default getDbPool;


// ///FUNCIONA DE FORMA LOCAL

// import { Pool } from 'pg';

// async function getDbPool() {
//   const pool = new Pool({
//     host: "localhost",
//     user: "postgres",
//     password: "Lioben2000!#",
//     database: "TEX_db",
//     port: 5432,
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
