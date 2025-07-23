<template>
    <FormLayout @submit="handleSubmit" class="flex flex-col gap-5">
        <FormFieldsContainer>
            <FormTextField
                v-model="formData.nombre"
                label="Nombre de la Ciudad"
                required
                placeholder="Ingresa el nombre de la ciudad"
                :error="errors.nombre"
            />
            <FormSelectField
                v-model="formData.paises_id"
                label="País"
                required
                :options="paisesOptions"
                placeholder="Seleccionar país"
                :error="errors.paises_id"
            />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormSelectField
                v-model="formData.estado"
                label="Estado"
                required
                :options="estadoOptions"
                placeholder="Seleccionar estado"
                :error="errors.estado"
            />
        </FormFieldsContainer>

        <div class="flex justify-center items-center flex-wrap gap-8 mt-3">
            <ButtonPrimary @click="$emit('cancel')" class="!bg-gray-mid !text-dark">
                Cancelar
            </ButtonPrimary>
            <ButtonPrimary type="submit" :disabled="isSubmitting">
                <span v-if="!isSubmitting">Crear Ciudad</span>
                <span v-else class="flex items-center gap-2">
                    <Icon name="tabler:loader-2" class="animate-spin" />
                    Creando...
                </span>
            </ButtonPrimary>
        </div>
    </FormLayout>
</template>

<script setup>
import destinosData from '~/shared/destinos/destinos.js'
import ciudadesData from '~/shared/ciudades/ciudades.js'

const emit = defineEmits(['success', 'cancel'])

const formData = ref({
    nombre: '',
    estado: 'activo',
    paises_id: null
})

const errors = ref({})
const isSubmitting = ref(false)

// Opciones para selects
const estadoOptions = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' }
]

// Cargar países (destinos con regionId)
const paisesOptions = computed(() => {
    return destinosData
        .filter(destino => destino.regionId) // Solo países
        .map(pais => ({
            value: pais.id,
            label: pais.nombre
        }))
})

const validateForm = () => {
    errors.value = {}
    
    if (!formData.value.nombre) errors.value.nombre = 'El nombre es requerido'
    if (!formData.value.paises_id) errors.value.paises_id = 'El país es requerido'
    if (!formData.value.estado) errors.value.estado = 'El estado es requerido'
    
    return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
    if (!validateForm()) return
    
    isSubmitting.value = true
    
    try {
        const dataToSubmit = { ...formData.value }
        
        // Generar ID único
        const maxId = Math.max(...ciudadesData.map(c => c.id)) + 1
        dataToSubmit.id = maxId
        
        console.log('Creando ciudad:', dataToSubmit)
        
        // Aquí harías la llamada a la API
        // await fetch('/api/ciudades/create', {
        //     method: 'POST',
        //     body: JSON.stringify(dataToSubmit)
        // })
        
        emit('success')
        
    } catch (error) {
        console.error('Error al crear ciudad:', error)
        // Mostrar error al usuario
    } finally {
        isSubmitting.value = false
    }
}
</script>
