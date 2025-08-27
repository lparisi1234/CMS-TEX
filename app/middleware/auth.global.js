export default defineNuxtRouteMiddleware(async (to, from) => {
  // Verificar autenticación para todas las rutas
  try {
    const response = await $fetch('/api/auth/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
 
    if (response?.authenticated && to.path === '/login') {   
      return navigateTo('/')
    }

    if (!response?.authenticated && to.path !== '/login') {
    
      return navigateTo('/login')
    }

  } catch (error) {
   
    if (to.path !== '/login') {
      return navigateTo('/login')
    }
  }
})