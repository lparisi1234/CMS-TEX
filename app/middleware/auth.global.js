export default defineNuxtRouteMiddleware(async (to, from) => {
  // No aplicar middleware en rutas de autenticación
  if (to.path === '/login') {
    return
  }

  // Verificar autenticación para todas las demás rutas
  try {
    const response = await $fetch('/api/auth/verify')
    
    if (!response.authenticated) {
      return navigateTo('/login')
    }
  } catch (error) {
    console.error('Error checking auth:', error)
    return navigateTo('/login')
  }
})
