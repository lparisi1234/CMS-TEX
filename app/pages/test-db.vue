<template>
  <DefaultSection>
    <HeadingH1>Test de Conexión a Base de Datos</HeadingH1>
    
    <div class="space-y-4 mt-8">
      <!-- Botón para testear la conexión -->
      <ButtonPrimary @click="testConnection" :disabled="pending">
        {{ pending ? 'Testeando...' : 'Testear Conexión DB' }}
      </ButtonPrimary>

      <!-- Mostrar resultados -->
      <div v-if="data" class="p-4 rounded-lg" :class="data.success ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'">
        <h3 class="font-semibold mb-2" :class="data.success ? 'text-green-800' : 'text-red-800'">
          {{ data.success ? '✅ Conexión Exitosa' : '❌ Error de Conexión' }}
        </h3>
        
        <div v-if="data.success" class="text-green-700">
          <p><strong>Timestamp del servidor:</strong> {{ data.time.now }}</p>
        </div>
        
        <div v-else class="text-red-700">
          <p><strong>Error:</strong> {{ data.error?.message || 'Error desconocido' }}</p>
          <pre v-if="data.error" class="mt-2 text-xs bg-red-50 p-2 rounded">{{ JSON.stringify(data.error, null, 2) }}</pre>
        </div>
      </div>

      <!-- Mostrar error de la petición HTTP -->
      <div v-if="error" class="p-4 bg-red-100 border border-red-400 rounded-lg">
        <h3 class="font-semibold text-red-800 mb-2">❌ Error de Red</h3>
        <p class="text-red-700">{{ error.message }}</p>
      </div>

      <!-- Información adicional -->
      <div class="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 class="font-semibold text-gray-800 mb-2">📋 Información del Test</h3>
        <ul class="text-sm text-gray-600 space-y-1">
          <li><strong>Endpoint:</strong> /api/testdb</li>
          <li><strong>Método:</strong> GET</li>
          <li><strong>Propósito:</strong> Verificar conectividad con PostgreSQL</li>
          <li><strong>Estado:</strong> {{ pending ? 'Ejecutando...' : 'Listo' }}</li>
        </ul>
      </div>
    </div>
  </DefaultSection>
</template>

<script setup>
// Método 1: Usando $fetch (recomendado para Nuxt 3)
const { data, pending, error, refresh: testConnection } = await useLazyFetch('/api/testdb')

// Método alternativo usando composable personalizado
const testConnectionManual = async () => {
  try {
    const result = await $fetch('/api/testdb')
    console.log('Resultado del test DB:', result)
    return result
  } catch (err) {
    console.error('Error al testear DB:', err)
    throw err
  }
}

// Método alternativo usando fetch nativo
const testConnectionNative = async () => {
  try {
    const response = await fetch('/api/testdb')
    const result = await response.json()
    console.log('Resultado del test DB (fetch nativo):', result)
    return result
  } catch (err) {
    console.error('Error al testear DB (fetch nativo):', err)
    throw err
  }
}

// Para testear automáticamente al cargar la página
onMounted(() => {
  console.log('Componente montado, datos iniciales:', data.value)
})
</script>
