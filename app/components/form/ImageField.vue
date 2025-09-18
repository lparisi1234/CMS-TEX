<template>
    <div class="w-full flex flex-col gap-2">
        <FormLabel :id="id" :required="required" v-if="label">{{ label }} ({{ size }})</FormLabel>

        <div class="flex flex-col gap-3">
            <div @click="triggerFileInput" @dragover.prevent @dragenter.prevent @drop.prevent="handleDrop"
                class="bg-light border-2 border-dashed rounded-[5px] text-center cursor-pointer transition-colors p-6">
                <div v-if="!imagePreview" class="space-y-2">
                    <Icon name="tabler:cloud-upload" class="mx-auto text-4xl text-dark" />
                    <p class="text-dark">
                        Haz clic aquí o arrastra una imagen o video
                    </p>
                    <p class="text-sm text-dark font-light">
                        Formatos Recomendados: WEBP, SVG, JPG, MP4
                    </p>
                </div>

                <div v-else class="flex flex-col items-center gap-2">
                    <video v-if="isVideo" :src="imagePreview" class="mx-auto max-h-32 rounded border" controls />
                    <img v-else :src="imagePreview" alt="Preview" class="mx-auto max-h-32 rounded border" />
                    <p class="text-sm text-dark">{{ fileName }}</p>
                    <button type="button" @click.stop="removeImage"
                        class="text-error text-sm">
                        Eliminar {{ isVideo ? 'video' : 'imagen' }}
                    </button>
                </div>
            </div>

            <input ref="fileInput" type="file" accept="image/*,video/mp4" @change="handleFileSelect" class="hidden"
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
        default: 5 * 1024 * 1024
    },
    targetFolder: {
        type: String,
        required: true
    },
    size: {
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
const isVideo = ref(false)

const inputId = computed(() => props.id)

watch(() => props.modelValue, (newValue) => {
    if (newValue && newValue !== imagePreview.value) {
        imagePreview.value = newValue
        fileName.value = newValue.split('/').pop() || 'archivo'
        const extension = fileName.value.split('.').pop().toLowerCase()
        isVideo.value = extension === 'mp4'
    }
}, { immediate: true })

const triggerFileInput = () => {
    fileInput.value?.click()
}

const validateFile = (file) => {
    const isImage = file.type.startsWith('image/')
    const isMP4Video = file.type === 'video/mp4'
    
    if (!isImage && !isMP4Video) {
        throw new Error('El archivo debe ser una imagen o un video MP4')
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
        isVideo.value = file.type === 'video/mp4'

        const reader = new FileReader()
        reader.onload = (e) => {
            imagePreview.value = e.target.result
        }
        reader.readAsDataURL(file)

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
    if (imagePreview.value && imagePreview.value.startsWith('https://')) {
        try {
            await deleteImageFromS3(imagePreview.value)
        } catch (error) {
            console.error('Error eliminando archivo de S3:', error)
        }
    }
    
    imagePreview.value = ''
    fileName.value = ''
    isVideo.value = false
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

defineExpose({
    deleteImageFromS3,
    removeImage,
    imagePreview: readonly(imagePreview)
})
</script>
