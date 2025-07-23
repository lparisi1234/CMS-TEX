import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { setCookie } from 'h3';


const poolData = {
  UserPoolId: 'us-east-1_UHXHtznPZ',
  ClientId: '6nfva878p5tq9u7sulp2iqigi7',
};

const userPool = new CognitoUserPool(poolData);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email y contraseña requeridos' });
  }

  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        const cookieOptions = {
          httpOnly: true,
          secure: false, // true en producción
          sameSite: 'lax' as const,
          maxAge: 60 * 60 * 24,
          path: '/',
        };

        setCookie(event, 'AccessToken', result.getAccessToken().getJwtToken(), cookieOptions);
        setCookie(event, 'IdToken', result.getIdToken().getJwtToken(), cookieOptions);
        setCookie(event, 'RefreshToken', result.getRefreshToken().getToken(), cookieOptions);

        resolve({ status: 'SUCCESS' });
      },
      onFailure: (err) => {
        reject(createError({ statusCode: 401, statusMessage: err.message || 'Error de autenticación' }));
      },
    });
  });
});
