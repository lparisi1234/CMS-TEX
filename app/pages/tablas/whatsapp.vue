<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>Número de WhatsApp</HeadingH1>

        <div class="flex items-center flex-wrap gap-6">
            <div class="flex items-center flex-wrap gap-2">
                <FormLabel id="whatsapp" class="font-medium">
                    Teléfono actual publicado:
                </FormLabel>
                <div class="w-64">
                    <p v-if="!isEditing" class="w-full text-xl font-light">{{ currentWhatsapp || 'No configurado' }}</p>
                    <FormTextField v-else id="whatsapp" v-model="editedWhatsapp" type="text"
                        placeholder="+54 9 11 1234-5678" @keyup.enter="handleSave" @keyup.escape="handleCancel"
                        ref="whatsappInput" class="w-full" />
                </div>
            </div>

            <div class="flex items-center gap-2">
                <button v-if="!isEditing" @click="startEditing"
                    class="w-10 h-10 flex justify-center items-center bg-gray-mid rounded-[5px]"
                    aria-label="Editar WhatsApp">
                    <Icon name="tabler:edit" class="w-5 h-5 text-primary" />
                </button>

                <template v-else>
                    <button @click="handleSave"
                        class="flex items-center bg-primary text-light rounded-lg p-2">
                        <Icon name="tabler:check" class="w-5 h-5" />
                    </button>
                    <button @click="handleCancel"
                        class="flex items-center bg-gray-dark text-light rounded-lg p-2">
                        <Icon name="tabler:x" class="w-5 h-5" />
                    </button>
                </template>
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
        // PUT

        currentWhatsapp.value = editedWhatsapp.value
        isEditing.value = false

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
