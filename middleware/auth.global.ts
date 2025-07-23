export default defineNuxtRouteMiddleware((to, from) => {
  // Permitir acceso a la ruta de login sin validar
  if (to.path === '/login') return

  // Ejecutar solo en SSR (lado del servidor)
  if (process.server) {
    const accessToken = useCookie('AccessToken')
    if (!accessToken.value) {
      return navigateTo('/login')
    }
  }
})