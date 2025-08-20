/**
 * Composable para testear la conexión a la base de datos
 * Uso: const { testDb, isLoading, dbStatus } = useDbTest()
 */
export const useDbTest = () => {
  const isLoading = ref(false)
  const dbStatus = ref(null)
  const lastError = ref(null)

  const testDb = async () => {
    isLoading.value = true
    lastError.value = null
    
    try {
      const result = await $fetch('/api/testdb')
      dbStatus.value = result
      
      if (result.success) {
        console.log('✅ Base de datos conectada correctamente:', result.time)
      } else {
        console.warn('⚠️ Test de DB falló:', result.error)
      }
      
      return result
    } catch (error) {
      lastError.value = error
      console.error('❌ Error al testear conexión DB:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Test automático al usar el composable
  const testOnMount = async () => {
    await testDb()
  }

  return {
    testDb,
    testOnMount,
    isLoading: readonly(isLoading),
    dbStatus: readonly(dbStatus),
    lastError: readonly(lastError),
    isConnected: computed(() => dbStatus.value?.success === true)
  }
}
