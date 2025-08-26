export const useAuth = () => {
  const isAuthenticated = ref(false)
  const user = ref(null)
  const router = useRouter()

  // Verificar si el usuario está autenticado
  const checkAuth = async () => {
    try {
      const response = await $fetch('/api/auth/verify', {
        method: 'GET'
      })
      
      if (response.authenticated) {
        isAuthenticated.value = true
        user.value = response.user
        return true
      } else {
        isAuthenticated.value = false
        user.value = null
        return false
      }
    } catch (error) {
      isAuthenticated.value = false
      user.value = null
      return false
    }
  }

  // Logout
  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      isAuthenticated.value = false
      user.value = null
      await router.push('/login')
    }
  }

  // Proteger rutas
  const requireAuth = async () => {
    const authenticated = await checkAuth()
    if (!authenticated) {
      await router.push('/login')
      return false
    }
    return true
  }

  return {
    isAuthenticated: readonly(isAuthenticated),
    user: readonly(user),
    checkAuth,
    logout,
    requireAuth
  }
}
