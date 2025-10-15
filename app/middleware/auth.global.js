export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return
  
  try {
    const response = await $fetch('/api/auth/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const isAuthenticated = response?.authenticated || false
    
    if (isAuthenticated && to.path === '/login') {   
      return navigateTo('/')
    }

    if (!isAuthenticated && to.path !== '/login') {
      return navigateTo('/login')
    }

  } catch (error) {
    if (to.path !== '/login') {
      return navigateTo('/login')
    }
  }
})