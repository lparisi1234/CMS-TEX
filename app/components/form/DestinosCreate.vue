<template>
    <FormLayout @submit="handleSubmit" class="flex flex-col gap-5">
        <FormFieldsContainer>
            <FormTextField
                v-model="formData.nombre"
                label="Nombre"
                required
                placeholder="Ingresa el nombre del destino"
                :error="errors.nombre"
            />
            <FormTextField
                v-model="formData.url"
                label="URL"
                required
                placeholder="/destinos/nombre-destino"
                :error="errors.url"
            />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField
                v-model="formData.h1"
                label="H1"
                required
                placeholder="Título principal"
                :error="errors.h1"
            />
            <FormTextField
                v-model="formData.h2"
                label="H2"
                required
                placeholder="Subtítulo"
                :error="errors.h2"
            />
        </FormFieldsContainer>

        <!-- Campo específico para países: seleccionar región -->
        <FormFieldsContainer v-if="tipo === 'pais'">
            <FormSelectField
                v-model="formData.regionId"
                label="Región"
                required
                :options="regionesOptions"
                placeholder="Seleccionar región"
                :error="errors.regionId"
            />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField
                v-model="formData.video_mobile"
                label="Video Mobile"
                placeholder="URL del video para móvil"
                :error="errors.video_mobile"
            />
            <FormTextField
                v-model="formData.video_desktop"
                label="Video Desktop"
                placeholder="URL del video para escritorio"
                :error="errors.video_desktop"
            />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField
                v-model="formData.consejo_experto"
                label="Consejo del Experto"
                placeholder="Consejo útil para los viajeros"
                :error="errors.consejo_experto"
            />
            <FormImageField
                v-model="formData.img"
                label="Imagen"
                :error="errors.img"
            />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField
                v-model="formData.txt_search"
                label="Texto de Búsqueda"
                placeholder="Palabras clave separadas por comas"
                :error="errors.txt_search"
            />
            <FormTextField
                v-model="formData.mapa"
                label="Coordenadas del Mapa"
                placeholder="latitud,longitud"
                :error="errors.mapa"
            />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField
                v-model="formData.meta_titulo"
                label="Meta Título"
                placeholder="Título para SEO"
                :error="errors.meta_titulo"
            />
            <FormTextField
                v-model="formData.meta_descripcion"
                label="Meta Descripción"
                placeholder="Descripción para SEO"
                :error="errors.meta_descripcion"
            />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField
                v-model="formData.meta_keywords"
                label="Meta Keywords"
                placeholder="Palabras clave para SEO"
                :error="errors.meta_keywords"
            />
            <FormTextField
                v-model="formData.desde_precio"
                label="Precio Desde"
                type="number"
                step="0.01"
                placeholder="0.00"
                :error="errors.desde_precio"
            />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField
                v-model="formData.nro_orden"
                label="Número de Orden"
                type="number"
                placeholder="1"
                :error="errors.nro_orden"
            />
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
                <span v-if="!isSubmitting">Crear {{ tipo === 'region' ? 'Región' : tipo === 'pais' ? 'País' : 'Destino' }}</span>
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

const props = defineProps({
    tipo: {
        type: String,
        default: 'destino' // 'region', 'pais', 'destino'
    }
})

const emit = defineEmits(['success', 'cancel'])

const formData = ref({
    nombre: '',
    url: '',
    h1: '',
    h2: '',
    video_mobile: '',
    video_desktop: '',
    experto_id: 1,
    consejo_experto: '',
    img: '',
    txt_search: '',
    meta_titulo: '',
    meta_descripcion: '',
    meta_keywords: '',
    mapa: '',
    estado: 'activo',
    nro_orden: 1,
    desde_precio: 0,
    regionId: props.tipo === 'pais' ? null : undefined
})

const errors = ref({})
const isSubmitting = ref(false)

// Opciones para selects
const estadoOptions = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' }
]

// Cargar regiones para el select (solo si es un país)
const regionesOptions = computed(() => {
    if (props.tipo !== 'pais') return []
    
    return destinosData
        .filter(destino => !destino.regionId) // Solo regiones
        .map(region => ({
            value: region.id,
            label: region.nombre
        }))
})

const validateForm = () => {
    errors.value = {}
    
    if (!formData.value.nombre) errors.value.nombre = 'El nombre es requerido'
    if (!formData.value.url) errors.value.url = 'La URL es requerida'
    if (!formData.value.h1) errors.value.h1 = 'El H1 es requerido'
    if (!formData.value.h2) errors.value.h2 = 'El H2 es requerido'
    if (!formData.value.estado) errors.value.estado = 'El estado es requerido'
    
    if (props.tipo === 'pais' && !formData.value.regionId) {
        errors.value.regionId = 'La región es requerida para países'
    }
    
    return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
    if (!validateForm()) return
    
    isSubmitting.value = true
    
    try {
        // Preparar datos según el tipo
        const dataToSubmit = { ...formData.value }
        
        // Generar ID único
        const maxId = Math.max(...destinosData.map(d => d.id)) + 1
        dataToSubmit.id = maxId
        
        // Para regiones, no debe tener regionId
        if (props.tipo === 'region') {
            delete dataToSubmit.regionId
        }
        
        console.log(`Creando ${props.tipo}:`, dataToSubmit)
        
        // Aquí harías la llamada a la API
        // await fetch('/api/destinos/create', {
        //     method: 'POST',
        //     body: JSON.stringify(dataToSubmit)
        // })
        
        emit('success')
        
    } catch (error) {
        console.error('Error al crear destino:', error)
        // Mostrar error al usuario
    } finally {
        isSubmitting.value = false
    }
}
</script>
