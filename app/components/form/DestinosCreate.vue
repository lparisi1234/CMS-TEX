<template>
    <FormLayout @submit="handleSubmit" class="flex flex-col gap-5">
        <FormFieldsContainer>
            <FormTextField v-model="formData.nombre" label="Nombre" required placeholder="Ingresa el nombre del destino"
                :error="errors.nombre" id="destino-nombre" />
            <FormTextField v-model="formData.url" label="URL" required placeholder="/destinos/nombre-destino"
                :error="errors.url" id="destino-url" />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField v-model="formData.h1" label="H1" required placeholder="Título principal" :error="errors.h1"
                id="destino-h1" />
            <FormTextField v-model="formData.h2" label="H2" required placeholder="Subtítulo" :error="errors.h2"
                id="destino-h2" />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormImageField v-model="formData.img" label="Imagen" :error="errors.img" id="destino-img" />
            <FormSelectField v-if="tipo === 'pais'" v-model="formData.regionId" label="Región" required
                :options="regionesOptions" placeholder="Seleccionar región" :error="errors.regionId" />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField v-model="formData.video_mobile" label="Video Mobile" placeholder="URL del video para móvil"
                :error="errors.video_mobile" id="destino-video-mobile" />
            <FormTextField v-model="formData.video_desktop" label="Video Desktop"
                placeholder="URL del video para escritorio" :error="errors.video_desktop" id="destino-video-desktop" />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormSelectField v-model="formData.experto_id" label="Experto" :options="expertosOptions"
                placeholder="Seleccionar experto" :error="errors.experto_id" />
            <FormTextField v-model="formData.consejo_experto" label="Consejo del Experto"
                placeholder="Consejo útil para los viajeros" :error="errors.consejo_experto"
                id="destino-consejo-experto" />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField v-model="formData.txt_search" label="Texto de Búsqueda"
                placeholder="Palabras clave separadas por comas" :error="errors.txt_search" id="destino-txt-search" />
            <FormTextField v-model="formData.mapa" label="Coordenadas del Mapa" placeholder="latitud,longitud"
                :error="errors.mapa" id="destino-mapa" />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField v-model="formData.meta_titulo" label="Meta Título" placeholder="Título para SEO"
                :error="errors.meta_titulo" id="destino-meta-titulo" />
            <FormTextField v-model="formData.meta_descripcion" label="Meta Descripción"
                placeholder="Descripción para SEO" :error="errors.meta_descripcion" id="destino-meta-descripcion" />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField v-model="formData.meta_keywords" label="Meta Keywords" placeholder="Palabras clave para SEO"
                :error="errors.meta_keywords" id="destino-meta-keywords" />
            <FormTextField v-model="formData.desde_precio" label="Precio Desde" type="number" step="0.01"
                placeholder="0.00" :error="errors.desde_precio" id="destino-desde-precio" />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField v-model="formData.nro_orden" label="Número de Orden" type="number" placeholder="1"
                :error="errors.nro_orden" id="destino-nro-orden" />
            <FormSelectField v-model="formData.estado" label="Estado" required :options="badgeOptions"
                placeholder="Seleccionar estado" :error="errors.estado" />
        </FormFieldsContainer>

        <div class="flex justify-center items-center flex-wrap gap-8 mt-3">
            <ButtonPrimary @click="$emit('cancel')" class="!bg-gray-mid !text-dark">
                Cancelar
            </ButtonPrimary>
            <ButtonPrimary type="submit" :disabled="isSubmitting">
                <span v-if="!isSubmitting">
                    {{ props.isEditing ? 'Actualizar' : 'Crear' }}
                    {{ tipo === 'region' ? 'Región' : tipo === 'pais' ? 'País' : 'Destino' }}
                </span>
                <span v-else class="flex items-center gap-2">
                    <Icon name="tabler:loader-2" class="animate-spin" />
                    {{ props.isEditing ? 'Actualizando...' : 'Creando...' }}
                </span>
            </ButtonPrimary>
        </div>
    </FormLayout>
</template>

<script setup>
import destinosData from '~/shared/destinos/destinos.js'
import expertosData from '~/shared/expertos/expertos.js'

const { badgeOptions } = useDynamicForm('destinos')

const props = defineProps({
    tipo: {
        type: String,
        default: 'destino'
    },
    isEditing: {
        type: Boolean,
        default: false
    },
    editingData: {
        type: Object,
        default: null
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
    experto_id: '',
    consejo_experto: '',
    img: '',
    txt_search: '',
    meta_titulo: '',
    meta_descripcion: '',
    meta_keywords: '',
    mapa: '',
    estado: 'activo',
    nro_orden: '',
    desde_precio: '',
    regionId: props.tipo === 'pais' ? null : undefined
})

const errors = ref({})
const isSubmitting = ref(false)

const expertosOptions = computed(() => {
    return expertosData.map(experto => ({
        value: experto.id,
        label: experto.nombre
    }))
})

const regionesOptions = computed(() => {
    if (props.tipo !== 'pais') return []

    return destinosData
        .filter(destino => !destino.regionId)
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
        const dataToSubmit = { ...formData.value }

        if (props.tipo === 'region') {
            delete dataToSubmit.regionId
        }

        if (props.isEditing) {
            // PUT para actualizar
            console.log('Actualizando destino:', dataToSubmit)
        } else {
            // POST para crear
            console.log('Creando destino:', dataToSubmit)
        }

        emit('success')

    } catch (error) {
        console.error('Error al procesar destino:', error)
    } finally {
        isSubmitting.value = false
    }
}

// Inicializar datos cuando está en modo edición
watch(() => props.editingData, (newData) => {
    if (newData && props.isEditing) {
        Object.keys(formData.value).forEach(key => {
            if (newData.hasOwnProperty(key)) {
                formData.value[key] = newData[key]
            }
        })
    }
}, { immediate: true })
</script>
