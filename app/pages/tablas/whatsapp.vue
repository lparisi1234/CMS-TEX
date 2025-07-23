<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>Número de WhatsApp</HeadingH1>
        
        <div class="bg-white rounded-lg shadow-sm border p-6 max-w-2xl">
            <div class="flex items-center justify-between">
                <div class="flex-1 mr-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Número de WhatsApp:
                    </label>
                    
                    <!-- Modo visualización -->
                    <div v-if="!isEditing" class="text-lg font-semibold text-gray-900">
                        {{ currentWhatsapp || 'No configurado' }}
                    </div>
                    
                    <!-- Modo edición -->
                    <div v-else class="flex items-center gap-3">
                        <input
                            v-model="editedWhatsapp"
                            type="text"
                            placeholder="+54 9 11 1234-5678"
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                            @keyup.enter="handleSave"
                            @keyup.escape="handleCancel"
                            ref="whatsappInput"
                        />
                    </div>
                </div>
                
                <!-- Botones de acción -->
                <div class="flex items-center gap-2">
                    <ButtonPrimary v-if="!isEditing" @click="startEditing" class="!px-4">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Editar
                    </ButtonPrimary>
                    
                    <template v-else>
                        <button @click="handleSave" class="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </button>
                        <button @click="handleCancel" class="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </DefaultSection>
</template>

<script setup>
import whatsappData from '~/shared/whatsapp/whatsapp.js'

const isEditing = ref(false)
const currentWhatsapp = ref('')
const editedWhatsapp = ref('')
const whatsappInput = ref(null)

// Cargar el primer número de WhatsApp (asumimos que solo hay uno)
onMounted(() => {
    if (whatsappData.length > 0) {
        currentWhatsapp.value = whatsappData[0].whatsapp
        editedWhatsapp.value = whatsappData[0].whatsapp
    }
})

const startEditing = () => {
    isEditing.value = true
    nextTick(() => {
        if (whatsappInput.value) {
            whatsappInput.value.focus()
        }
    })
}

const handleSave = async () => {
    if (!editedWhatsapp.value.trim()) {
        alert('Por favor, ingresa un número de WhatsApp válido')
        return
    }
    
    try {
        // Aquí harías la llamada a la API para guardar
        // await fetch('/api/whatsapp/update', { 
        //     method: 'PUT', 
        //     body: JSON.stringify({ whatsapp: editedWhatsapp.value })
        // })
        
        currentWhatsapp.value = editedWhatsapp.value
        isEditing.value = false
        
        console.log('WhatsApp actualizado:', editedWhatsapp.value)
    } catch (error) {
        console.error('Error al actualizar WhatsApp:', error)
        alert('Error al actualizar el número de WhatsApp')
    }
}

const handleCancel = () => {
    editedWhatsapp.value = currentWhatsapp.value
    isEditing.value = false
}
</script>
