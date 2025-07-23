import { deleteCookie } from 'h3';

export default defineEventHandler((event) => {
  deleteCookie(event, 'AccessToken');
  deleteCookie(event, 'IdToken');
  deleteCookie(event, 'RefreshToken');

  return { message: 'Sesión cerrada' };
});
