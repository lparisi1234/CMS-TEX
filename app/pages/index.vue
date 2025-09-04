<template>
    <DefaultSection>
        <HeadingH1>Home Test - Prueba ImageField</HeadingH1>
        <div class="mt-8 max-w-md mx-auto">
            <FormImageField 
                id="test-image"
                label="Subir imagen a S3"
                @upload-complete="onUploadComplete"
                @upload-error="onUploadError"
            />
            
            <div v-if="uploadResult" class="mt-4 p-3 rounded-md" :class="uploadResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ uploadResult.message }}
            </div>
        </div>
    </DefaultSection>
</template>

<script setup>
import { ref } from "vue"

const uploadResult = ref(null)

const onUploadComplete = (s3Url) => {
    uploadResult.value = {
        success: true,
        message: `Imagen subida exitosamente a: ${s3Url}`
    }
}

const onUploadError = (error) => {
    uploadResult.value = {
        success: false,
        message: `Error: ${error}`
    }
}
</script>