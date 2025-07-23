import { getCookie } from 'h3'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'AccessToken')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'No autorizado' })
  }

  return { loggedIn: true }
})
