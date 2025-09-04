<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Subir Imagen a S3</h2>
    
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Seleccionar imagen
      </label>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>

    <div v-if="selectedFile" class="mb-4">
      <p class="text-sm text-gray-600">
        Archivo seleccionado: {{ selectedFile.name }}
      </p>
      <p class="text-xs text-gray-500">
        Tamaño: {{ formatFileSize(selectedFile.size) }}
      </p>
    </div>

    <button
      @click="uploadImage"
      :disabled="!selectedFile || uploading"
      class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {{ uploading ? 'Subiendo...' : 'Subir a S3' }}
    </button>

    <div v-if="uploadResult" class="mt-4 p-3 rounded-md" :class="uploadResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
      {{ uploadResult.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps  } from 'vue'

const props = defineProps({
      targetFolder: { type: String, required: true }
    })

const fileInput = ref(null)
const selectedFile = ref(null)
const uploading = ref(false)
const uploadResult = ref(null)

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    uploadResult.value = null
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadImage = async () => {
  if (!selectedFile.value) return

  uploading.value = true
  uploadResult.value = null

  try {
    const formData = new FormData()
    formData.append('image', selectedFile.value)
    formData.append('targetFolder', props.targetFolder);

    const response = await $fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    })

    uploadResult.value = {
      success: true,
      message: `Imagen subida exitosamente: ${response.s3Url}`
    }

    // Limpiar el input
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }

  } catch (error) {
    console.error('Error uploading image:', error)
    uploadResult.value = {
      success: false,
      message: `Error al subir la imagen: ${error.data?.message || error.message}`
    }
  } finally {
    uploading.value = false
  }
}
</script>