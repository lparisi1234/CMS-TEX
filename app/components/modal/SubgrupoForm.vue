<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="w-full bg-white rounded-lg p-6 mx-4">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-dark">
                    {{ isEditing ? 'Editar Subgrupo' : 'Crear Subgrupo' }}
                </h2>
                <button @click="$emit('cancel')" type="button" class="text-gray-500 hover:text-gray-700">
                    <Icon name="tabler:x" class="w-6 h-6" />
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
                <FormTextField id="subgrupo-nombre" v-model="localFormData.nombre" label="Nombre del Subgrupo"
                    :required="true" :error="errors.nombre" placeholder="Ingresa el nombre del subgrupo" />

                <FormTextField id="subgrupo-orden" v-model="localFormData.nro_orden" label="Número de Orden"
                    type="number" :required="true" :error="errors.nro_orden" placeholder="Ingresa el orden" />

                <FormTextareaField id="subgrupo-productos" v-model="localFormData.productos_text"
                    label="IDs de Productos"
                    placeholder="Ingresa los IDs separados por espacios (ej: 3/2500254 3/2500298)" :rows="3"
                    :required="false" :error="errors.productos" />

                <div class="flex justify-end gap-3 mt-4">
                    <ButtonPrimary @click="$emit('cancel')" type="button" class="!bg-gray-mid !text-dark">
                        Cancelar
                    </ButtonPrimary>
                    <ButtonPrimary type="submit" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
                    </ButtonPrimary>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    subgrupo: {
        type: Object,
        default: null
    },
    existingOrders: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['submit', 'cancel'])

const isEditing = computed(() => !!props.subgrupo?.id)
const isSubmitting = ref(false)
const errors = ref({})

const localFormData = ref({
    nombre: '',
    nro_orden: 1,
    productos_text: ''
})

const resetForm = () => {
    localFormData.value = {
        nombre: '',
        nro_orden: getNextOrder(),
        productos_text: ''
    }
    errors.value = {}
}

const getNextOrder = () => {
    if (props.existingOrders.length === 0) return 1
    return Math.max(...props.existingOrders) + 1
}

const validateForm = () => {
    errors.value = {}

    if (!localFormData.value.nombre.trim()) {
        errors.value.nombre = 'El nombre es requerido'
    }

    if (!localFormData.value.nro_orden || localFormData.value.nro_orden < 1) {
        errors.value.nro_orden = 'El número de orden debe ser mayor a 0'
    }

    if (localFormData.value.productos_text.trim()) {
        const productosText = localFormData.value.productos_text.trim()
        const productos = productosText.split(',').map(p => p.trim()).filter(Boolean)

        const invalidProducts = productos.filter(id => !id || id.length === 0)
        if (invalidProducts.length > 0) {
            errors.value.productos = 'Hay IDs de productos vacíos'
        }
    }

    return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
    if (!validateForm()) return

    isSubmitting.value = true

    try {
        const productos = localFormData.value.productos_text.trim()
            ? localFormData.value.productos_text.split(',').map(p => p.trim()).filter(Boolean)
            : []

        const subgrupoData = {
            id: isEditing.value ? props.subgrupo.id : Date.now(),
            nombre: localFormData.value.nombre.trim(),
            nro_orden: parseInt(localFormData.value.nro_orden),
            productos: productos
        }

        emit('submit', subgrupoData)
    } catch (error) {
        console.error('Error al guardar subgrupo:', error)
    } finally {
        isSubmitting.value = false
    }
}

watch(() => props.isOpen, (newValue) => {
    if (newValue) {
        if (isEditing.value && props.subgrupo) {
            localFormData.value = {
                nombre: props.subgrupo.nombre || '',
                nro_orden: props.subgrupo.nro_orden || getNextOrder(),
                productos_text: Array.isArray(props.subgrupo.productos)
                    ? props.subgrupo.productos.join(', ')
                    : ''
            }
        } else {
            resetForm()
        }
        errors.value = {}
    }
})
</script>
