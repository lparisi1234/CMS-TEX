import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getCookie(event, 'AccessToken')
    const idToken = getCookie(event, 'IdToken')

    if (!accessToken || !idToken) {
    
      return { 
        authenticated: false,
        message: 'No tokens found'
      }
    }

    return {
      authenticated: true,
      user: {
        email: 'user@example.com',
        name: 'Usuario'
      }
    }

  } catch (error) {
    return { 
      authenticated: false,
      error: error.message 
    }
  }
})