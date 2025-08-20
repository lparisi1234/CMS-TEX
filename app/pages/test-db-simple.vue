<template>
  <DefaultSection>
    <HeadingH1>Test DB con Composable</HeadingH1>
    
    <div class="space-y-4 mt-8">
      <!-- Status de conexión -->
      <div class="flex items-center space-x-2">
        <div 
          class="w-3 h-3 rounded-full"
          :class="isConnected ? 'bg-green-500' : 'bg-red-500'"
        ></div>
        <span :class="isConnected ? 'text-green-600' : 'text-red-600'">
          {{ isConnected ? 'Conectado' : 'Desconectado' }}
        </span>
      </div>

      <!-- Botón de test -->
      <ButtonPrimary @click="testDb" :disabled="isLoading">
        {{ isLoading ? 'Testeando...' : 'Testear Conexión' }}
      </ButtonPrimary>

      <!-- Resultado -->
      <div v-if="dbStatus" class="p-4 rounded-lg bg-gray-50">
        <pre>{{ JSON.stringify(dbStatus, null, 2) }}</pre>
      </div>

      <!-- Error -->
      <div v-if="lastError" class="p-4 rounded-lg bg-red-50 text-red-700">
        <strong>Error:</strong> {{ lastError.message }}
      </div>
    </div>
  </DefaultSection>
</template>

<script setup>
const { testDb, isLoading, dbStatus, lastError, isConnected } = useDbTest()

// Test automático al montar el componente
onMounted(async () => {
  await testDb()
})
</script>
