<template>
    <div class="w-full flex flex-col gap-2">
        <FormLabel :id="id" :required="required" v-if="label">{{ label }}</FormLabel>

        <div class="flex flex-col gap-3">
            <div @click="triggerFileInput" @dragover.prevent @dragenter.prevent @drop.prevent="handleDrop"
                class="bg-light border-2 border-dashed rounded-[5px] text-center cursor-pointer transition-colors p-6">
                <div v-if="!imagePreview" class="space-y-2">
                    <Icon name="tabler:cloud-upload" class="mx-auto text-4xl text-dark" />
                    <p class="text-dark">
                        Haz clic aquí o arrastra una imagen
                    </p>
                    <p class="text-sm text-dark font-light">
                        Formatos Recomendados: WEBP, SVG, JPG
                    </p>
                </div>

                <div v-else class="flex flex-col items-center gap-2">
                    <img :src="imagePreview" alt="Preview" class="mx-auto max-h-32 rounded border" />
                    <p class="text-sm text-dark">{{ fileName }}</p>
                    <button type="button" @click.stop="removeImage"
                        class="text-error text-sm">
                        Eliminar imagen
                    </button>
                </div>
            </div>

            <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect" class="hidden"
                :id="inputId" />

            <div v-if="uploading" class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-primary h-2 rounded-full transition-all duration-300"
                    :style="{ width: uploadProgress + '%' }"></div>
            </div>
        </div>

        <FormError v-if="error && showError">{{ error }}</FormError>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    error: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        required: true,
    },
    maxSize: {
        type: Number,
        default: 5 * 1024 * 1024 // 5MB por defecto
    },
    targetFolder: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['update:modelValue', 'upload-start', 'upload-complete', 'upload-error'])

const fileInput = ref(null)
const imagePreview = ref('')
const fileName = ref('')
const isDragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const showError = ref(false)

const inputId = computed(() => props.id)

watch(() => props.modelValue, (newValue) => {
    if (newValue && newValue !== imagePreview.value) {
        imagePreview.value = newValue
        fileName.value = newValue.split('/').pop() || 'imagen.jpg'
    }
}, { immediate: true })

const triggerFileInput = () => {
    fileInput.value?.click()
}

const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen')
    }

    if (file.size > props.maxSize) {
        throw new Error(`El archivo no debe superar ${Math.round(props.maxSize / 1024 / 1024)}MB`)
    }

    return true
}

const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
        processFile(file)
    }
}

const handleDrop = (event) => {
    isDragging.value = false
    const files = event.dataTransfer.files
    if (files.length > 0) {
        processFile(files[0])
    }
}

const processFile = async (file) => {
    try {
        validateFile(file)

        fileName.value = file.name

        const reader = new FileReader()
        reader.onload = (e) => {
            imagePreview.value = e.target.result
        }
        reader.readAsDataURL(file)

        // Simular subida
        await simulateUpload(file)

        if (showError.value) {
            showError.value = false
        }

    } catch (error) {
        emit('upload-error', error.message)
        console.error('Error al procesar archivo:', error)
    }
}

const simulateUpload = async (file) => {
    uploading.value = true
    uploadProgress.value = 0

    emit('upload-start', file)

    try {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('targetFolder', props.targetFolder)

        const response = await $fetch('/api/upload-image', {
            method: 'POST',
            body: formData
        })

        const interval = setInterval(() => {
            uploadProgress.value += 20
            if (uploadProgress.value >= 100) {
                clearInterval(interval)
                uploading.value = false

                const finalUrl = response.s3Url
                emit('update:modelValue', finalUrl)
                emit('upload-complete', finalUrl)
            }
        }, 200)

    } catch (error) {
        uploading.value = false
        uploadProgress.value = 0
        emit('upload-error', error.message)
        throw error
    }
}

const deleteImageFromS3 = async (imageUrl) => {
    if (!imageUrl || !imageUrl.startsWith('https://')) {
        return
    }
    
    try {
        await $fetch('/api/delete-image', {
            method: 'POST',
            body: { imageUrl }
        })
    } catch (error) {
        console.error('Error eliminando imagen de S3:', error)
        throw error
    }
}

const removeImage = async () => {
    // Si hay una imagen cargada (no es solo preview local)
    if (imagePreview.value && imagePreview.value.startsWith('https://')) {
        try {
            // Llamar al endpoint para eliminar de S3
            await deleteImageFromS3(imagePreview.value)
        } catch (error) {
            console.error('Error eliminando imagen de S3:', error)
        }
    }
    
    // Limpiar estado local
    imagePreview.value = ''
    fileName.value = ''
    emit('update:modelValue', '')
    
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const handleDragEnter = () => {
    isDragging.value = true
}

const handleDragLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
        isDragging.value = false
    }
}

watchEffect(() => {
    if (props.error) {
        showError.value = true
    }
})

// Exponer métodos para uso externo
defineExpose({
    deleteImageFromS3,
    removeImage,
    imagePreview: readonly(imagePreview)
})
</script>
