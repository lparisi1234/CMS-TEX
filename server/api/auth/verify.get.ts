import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getCookie(event, 'AccessToken')
    const idToken = getCookie(event, 'IdToken')

    if (!accessToken || !idToken) {
      return { authenticated: false }
    }

    // Solo verificar que las cookies existan
    return {
      authenticated: true,
      user: {
        email: 'user@example.com', // Placeholder
        name: 'Usuario'
      }
    }

  } catch (error) {
    console.error('Error verifying auth:', error)
    return { authenticated: false }
  }
})
