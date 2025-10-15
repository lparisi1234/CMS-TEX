import { deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    deleteCookie(event, 'AccessToken', { path: '/' })
    deleteCookie(event, 'IdToken', { path: '/' })
    deleteCookie(event, 'RefreshToken', { path: '/' })

    return { status: 'SUCCESS', message: 'Logout exitoso' }
  } catch (error) {
    console.error('Error during logout:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al cerrar sesión' })
  }
})
