export default defineNuxtRouteMiddleware(async (to, from) => {
  // No aplicar middleware en rutas específicas
  const excludedPaths = ['/login', '/health', '/api/health']
  
  if (excludedPaths.includes(to.path)) {
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
