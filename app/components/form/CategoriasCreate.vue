<template>
    <FormLayout @submit="handleSubmit" class="flex flex-col gap-5">
        <TabsLayout :tabs="tabs">
            <template #detalle>
                <div class="flex flex-col gap-5">
                    <template v-for="(chunk, chunkIndex) in detailsColumnChunks" :key="`chunk-${chunkIndex}`">
                        <FormFieldsContainer>
                            <template v-for="column in chunk" :key="column.key">
                                <FormTextField v-if="column.type === 'text'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :error="errors[column.key]"
                                    :placeholder="`Ingresa ${column.label.toLowerCase()}`" />

                                <FormTextareaField v-else-if="column.type === 'textarea'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :error="errors[column.key]" :placeholder="`Ingresa ${column.label.toLowerCase()}`"
                                    :rows="4" />

                                <FormTextField v-else-if="column.type === 'number'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :error="errors[column.key]" type="number"
                                    :placeholder="`Ingresa ${column.label.toLowerCase()}`" />

                                <FormSelectField v-else-if="column.type === 'select'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :error="errors[column.key]" :options="selectOptions[column.key] || []"
                                    :loading="loadingOptions[column.key]"
                                    :placeholder="`Selecciona ${column.label.toLowerCase()}`" />

                                <FormSelectField v-else-if="column.type === 'badge'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :error="errors[column.key]" :options="badgeOptions"
                                    :placeholder="`Seleccionar ${column.label.toLowerCase()}`" />

                                <FormImageField v-else-if="column.type === 'image'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :error="errors[column.key]" />

                                <FormSwitchField v-else-if="column.type === 'boolean'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :error="errors[column.key]" />
                            </template>
                        </FormFieldsContainer>
                    </template>
                </div>
            </template>

            <template #subgrupos>
                <div class="flex flex-col gap-5">
                    <TableLayout :data="displaySubgrupos" :columns="subgruposColumns" :table-name="'Subgrupos'"
                        :show-actions="true" :empty-state-text="'No hay subgrupos creados'" @edit="handleEditSubgrupo"
                        @delete="handleDeleteSubgrupo" />

                    <div class="flex justify-start">
                        <ButtonPrimary @click.prevent.stop="openCreateModal" type="button">
                            + Agregar Subgrupo
                        </ButtonPrimary>
                    </div>
                </div>
            </template>
        </TabsLayout>

        <div class="flex justify-center flex-wrap items-center gap-5 mt-8">
            <ButtonPrimary @click="$emit('cancel')" type="button" class="!bg-gray-mid !text-dark">
                Cancelar
            </ButtonPrimary>

            <ButtonPrimary type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Creando...' : botonTexto }}
            </ButtonPrimary>
        </div>
    </FormLayout>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="handleModalBackgroundClick">
        <div class="w-full max-w-[56rem] flex flex-col gap-6 bg-white rounded-[20px] p-12" @click.stop>
            <HeadingH2 class="text-center">
                {{ isEditingSubgrupo ? 'Editar Subgrupo' : 'Crear Subgrupo' }}
            </HeadingH2>

            <form @submit.prevent="saveSubgrupo" class="flex flex-col gap-4">
                <FormFieldsContainer>
                    <FormTextField id="modal-nombre" v-model="modalSubgrupo.nombre" label="Nombre del Subgrupo"
                        placeholder="Ingresa el nombre del subgrupo" :required="true" :error="modalErrors.nombre" />

                    <FormTextField id="modal-orden" v-model="modalSubgrupo.nro_orden" label="Número de Orden"
                        type="number" placeholder="Ingresa el orden" :required="true" :error="modalErrors.nro_orden" />
                </FormFieldsContainer>

                <FormFieldsContainer>
                    <FormTextareaField id="modal-productos" v-model="modalSubgrupo.productos_text"
                        label="Productos (IDs separados por espacios)" placeholder="Ej: 3/2500254 3/2500298 3/2500314"
                        :rows="3" :required="false" :error="modalErrors.productos" />
                </FormFieldsContainer>

                <div class="flex justify-center gap-5 mt-2">
                    <ButtonPrimary @click.prevent="closeModal('cancel-button')" type="button"
                        class="!bg-gray-mid !text-dark">
                        Cancelar
                    </ButtonPrimary>
                    <ButtonPrimary type="submit">
                        {{ isEditingSubgrupo ? 'Actualizar' : 'Crear' }}
                    </ButtonPrimary>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    errors: {
        type: Object,
        required: true
    },
    selectOptions: {
        type: Object,
        required: true
    },
    loadingOptions: {
        type: Object,
        required: true
    },
    badgeOptions: {
        type: Array,
        required: true
    },
    isSubmitting: {
        type: Boolean,
        default: false
    },
    botonTexto: {
        type: String,
        default: 'Crear categoría'
    },
    detailsColumns: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['submit', 'cancel'])

const tabs = [
    { id: 'detalle', label: 'Detalle' },
    { id: 'subgrupos', label: 'Subgrupos' }
]

const showModal = ref(false)
const isEditingSubgrupo = ref(false)
const editingSubgrupoIndex = ref(-1)
const modalSubgrupo = ref({
    nombre: '',
    nro_orden: 1,
    productos_text: ''
})
const modalErrors = ref({
    nombre: '',
    nro_orden: '',
    productos: ''
})

const detailsColumnChunks = computed(() => {
    const filteredColumns = props.detailsColumns.filter(column => column.key !== 'subgrupos')
    const chunkSize = 2
    const chunks = []
    for (let i = 0; i < filteredColumns.length; i += chunkSize) {
        chunks.push(filteredColumns.slice(i, i + chunkSize))
    }
    return chunks
})

const subgruposColumns = [
    {
        key: 'nombre',
        label: 'Subgrupo',
        type: 'text',
        required: true
    },
    {
        key: 'nro_orden',
        label: 'Número de Orden',
        type: 'number',
        required: true
    },
    {
        key: 'productos',
        label: 'Productos',
        type: 'array-ids',
        required: false
    }
]

const displaySubgrupos = computed(() => {
    const subgrupos = props.formData.subgrupos || []

    if (!Array.isArray(subgrupos)) {
        console.warn('Los subgrupos no son un array:', subgrupos)
        return []
    }

    return subgrupos.map(subgrupo => ({
        ...subgrupo,
        productos: Array.isArray(subgrupo.productos)
            ? (subgrupo.productos.length > 0
                ? subgrupo.productos.map(id => String(id)).join(' ')
                : 'Sin productos')
            : String(subgrupo.productos || 'Sin productos')
    }))
})

const openCreateModal = (event) => {
    if (event) {
        event.preventDefault()
        event.stopPropagation()
    }

    isEditingSubgrupo.value = false
    editingSubgrupoIndex.value = -1
    modalSubgrupo.value = {
        nombre: '',
        nro_orden: (props.formData.subgrupos?.length || 0) + 1,
        productos_text: ''
    }
    modalErrors.value = {
        nombre: '',
        nro_orden: '',
        productos: ''
    }
    showModal.value = true
}

const handleEditSubgrupo = (subgrupo, index) => {
    nextTick(() => {
        editSubgrupo(subgrupo)
    })
}

const handleDeleteSubgrupo = (subgrupo, index) => {
    deleteSubgrupo(subgrupo)
}

const editSubgrupo = (subgrupo) => {
    const index = props.formData.subgrupos.findIndex(s => s.id === subgrupo.id)
    if (index !== -1) {
        isEditingSubgrupo.value = true
        editingSubgrupoIndex.value = index

        const originalSubgrupo = props.formData.subgrupos[index]

        modalSubgrupo.value = {
            nombre: originalSubgrupo.nombre || '',
            nro_orden: originalSubgrupo.nro_orden || 1,
            productos_text: Array.isArray(originalSubgrupo.productos)
                ? originalSubgrupo.productos.join(' ')
                : (originalSubgrupo.productos || '')
        }
        modalErrors.value = {
            nombre: '',
            nro_orden: '',
            productos: ''
        }

        showModal.value = true
    }
}

const closeModal = () => {
    showModal.value = false
    isEditingSubgrupo.value = false
    editingSubgrupoIndex.value = -1
    modalSubgrupo.value = {
        nombre: '',
        nro_orden: 1,
        productos_text: ''
    }
    modalErrors.value = {
        nombre: '',
        nro_orden: '',
        productos: ''
    }
}

const handleModalBackgroundClick = (event) => {
    if (event.target === event.currentTarget) {
        closeModal('background-click')
    }
}

const validateSubgrupo = () => {
    modalErrors.value = {
        nombre: '',
        nro_orden: '',
        productos: ''
    }

    let isValid = true

    if (!modalSubgrupo.value.nombre.trim()) {
        modalErrors.value.nombre = 'El nombre es requerido'
        isValid = false
    }

    if (!modalSubgrupo.value.nro_orden || modalSubgrupo.value.nro_orden < 1) {
        modalErrors.value.nro_orden = 'El número de orden debe ser mayor a 0'
        isValid = false
    }

    return isValid
}

const saveSubgrupo = () => {
    if (!validateSubgrupo()) {
        return
    }

    const productos = modalSubgrupo.value.productos_text
        ? modalSubgrupo.value.productos_text
            .split(/\s+/)
            .map(id => id.trim())
            .filter(id => id.length > 0)
        : []

    const subgrupoData = {
        id: isEditingSubgrupo.value
            ? props.formData.subgrupos[editingSubgrupoIndex.value].id
            : Date.now(),
        nombre: modalSubgrupo.value.nombre.trim(),
        nro_orden: parseInt(modalSubgrupo.value.nro_orden),
        productos: productos
    }

    if (!props.formData.subgrupos) {
        props.formData.subgrupos = []
    }

    if (isEditingSubgrupo.value) {
        props.formData.subgrupos[editingSubgrupoIndex.value] = subgrupoData
    } else {
        props.formData.subgrupos.push(subgrupoData)
    }

    closeModal('form-submitted')
}

const deleteSubgrupo = (subgrupo) => {
    const index = props.formData.subgrupos.findIndex(s => s.id === subgrupo.id)
    if (index !== -1) {
        props.formData.subgrupos.splice(index, 1)
        props.formData.subgrupos.forEach((sub, idx) => {
            sub.nro_orden = idx + 1
        })
    }
}

const handleSubmit = () => {
    emit('submit')
}

onMounted(() => {
    if (!props.formData.subgrupos) {
        props.formData.subgrupos = []
    }

    if (!Array.isArray(props.formData.subgrupos)) {
        props.formData.subgrupos = []
    }

    if (props.formData.subgrupos.length > 0) {
        props.formData.subgrupos.forEach(subgrupo => {
            if (!Array.isArray(subgrupo.productos)) {
                subgrupo.productos = []
            } else {
                subgrupo.productos = subgrupo.productos.map(id => String(id))
            }
        })
    }
})
</script>
