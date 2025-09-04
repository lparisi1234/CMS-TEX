<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">Test Delete Image S3</h1>
    
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
      <h2 class="text-xl font-semibold mb-4">Eliminar Imagen de S3</h2>
      
      <!-- Input para URL -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          URL de la imagen:
        </label>
        <input 
          v-model="imageUrl" 
          type="text" 
          placeholder="https://tex2-static-images-prd.s3.us-east-1.amazonaws.com/..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Preview de la imagen si hay URL -->
      <div v-if="imageUrl" class="mb-4">
        <p class="text-sm text-gray-600 mb-2">Preview:</p>
        <img 
          :src="imageUrl" 
          alt="Preview" 
          class="max-w-xs h-32 object-cover rounded border"
          @error="imageError = true"
        />
        <p v-if="imageError" class="text-red-500 text-sm mt-1">
          No se pudo cargar la imagen
        </p>
      </div>

      <!-- Botón de eliminar -->
      <button 
        @click="deleteImage"
        :disabled="!imageUrl || loading"
        class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <span v-if="loading">🔄</span>
        {{ loading ? 'Eliminando...' : 'Eliminar Imagen' }}
      </button>

      <!-- URLs de ejemplo -->
      <div class="mt-6 p-4 bg-gray-50 rounded">
        <p class="text-sm font-medium text-gray-700 mb-2">URLs de ejemplo:</p>
        <div class="space-y-2">
          <button 
            @click="imageUrl = 'https://tex2-static-images-prd.s3.us-east-1.amazonaws.com/notas-de-prensa/200e5252-85b7-4af3-bcc3-e2cb87479ad6.jpg'"
            class="text-xs text-blue-600 hover:text-blue-800 block truncate max-w-full"
          >
            Tu URL actual (con región)
          </button>
          <button 
            @click="imageUrl = 'https://tex2-static-images-prd.s3.amazonaws.com/test/ejemplo.jpg'"
            class="text-xs text-blue-600 hover:text-blue-800 block"
          >
            URL sin región (ejemplo)
          </button>
        </div>
      </div>

      <!-- Resultado -->
      <div v-if="result" class="mt-6 p-4 rounded" :class="result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
        <h3 class="font-semibold" :class="result.success ? 'text-green-800' : 'text-red-800'">
          {{ result.success ? '✅ Éxito' : '❌ Error' }}
        </h3>
        <p class="text-sm mt-1" :class="result.success ? 'text-green-700' : 'text-red-700'">
          {{ result.message }}
        </p>
        <div v-if="result.success && result.data" class="mt-2 text-xs text-green-600">
          <p><strong>Path eliminado:</strong> {{ result.data.deletedPath }}</p>
          <p v-if="result.data.stdout"><strong>AWS Output:</strong> {{ result.data.stdout }}</p>
        </div>
        <div v-if="!result.success && result.error" class="mt-2 text-xs text-red-600">
          <strong>Error:</strong> {{ result.error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const imageUrl = ref('')
const loading = ref(false)
const result = ref(null)
const imageError = ref(false)

// Reset error when URL changes
watch(imageUrl, () => {
  imageError.value = false
})

const deleteImage = async () => {
  if (!imageUrl.value) return
  
  loading.value = true
  result.value = null
  
  try {
    const response = await $fetch('/api/delete-image', {
      method: 'POST',
      body: { imageUrl: imageUrl.value }
    })
    
    result.value = {
      success: true,
      message: 'Imagen eliminada exitosamente',
      data: response
    }
    
  } catch (error) {
    console.error('Error:', error)
    result.value = {
      success: false,
      message: 'Error al eliminar la imagen',
      error: error.data?.message || error.message || 'Error desconocido'
    }
  } finally {
    loading.value = false
  }
}
</script>