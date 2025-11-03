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
                                    :error="errors[column.key]" targetFolder="categorias" :size="column.size" />

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
                        @delete="handleDeleteSubgrupo" :loading="isDeletingSubgrupo" />

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
        <div class="w-full max-w-[56rem] flex flex-col gap-6 bg-light rounded-[20px] p-12" @click.stop>
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

                <FormFieldsContainer>
                    <FormCheckboxGroupField id="modal-segmentos" v-model="modalSubgrupo.segmentos_excluidos"
                        :options="segmentosOptions" label="Segmentos Excluidos" />
                </FormFieldsContainer>

                <div class="flex justify-center gap-5 mt-2">
                    <ButtonPrimary @click.prevent="closeModal('cancel-button')" type="button"
                        class="!bg-gray-mid !text-dark">
                        Cancelar
                    </ButtonPrimary>
                    <ButtonPrimary type="submit" :disabled="isSubmittingSubgrupo">
                        {{ isSubmittingSubgrupo ? (isEditingSubgrupo ? 'Actualizando...' : 'Creando...') :
                            (isEditingSubgrupo ? 'Actualizar' : 'Crear') }}
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

const emit = defineEmits(['submit', 'cancel', 'categoria-created'])

const { success, error } = useNotification()

const segmentosData = ref([])

const tabs = [
    { id: 'detalle', label: 'Detalle' },
    { id: 'subgrupos', label: 'Subgrupos' }
]

const showModal = ref(false)
const isEditingSubgrupo = ref(false)
const editingSubgrupoIndex = ref(-1)
const editingSubgrupoId = ref(null)
const modalSubgrupo = ref({
    nombre: '',
    nro_orden: 1,
    productos_text: '',
    segmentos_excluidos: []
})
const modalErrors = ref({
    nombre: '',
    nro_orden: '',
    productos: ''
})
const isSubmittingSubgrupo = ref(false)
const isDeletingSubgrupo = ref(false)

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
    },
    {
        key: 'segmentos_excluidos',
        label: 'Segmentos Excluidos',
        type: 'text',
        required: false
    }
]

const segmentosOptions = computed(() => {
    return segmentosData.value.map(segmento => ({
        value: segmento.id,
        label: segmento.descripcion
    }))
})

const subgruposFromDb = ref([])

const displaySubgrupos = computed(() => {
    const subgrupos = subgruposFromDb.value || []

    if (!Array.isArray(subgrupos)) {
        console.warn('Los subgrupos no son un array:', subgrupos)
        return []
    }

    return subgrupos.map(subgrupo => ({
        ...subgrupo,
        productos: Array.isArray(subgrupo.productos_ids)
            ? (subgrupo.productos_ids.length > 0
                ? subgrupo.productos_ids.map(id => String(id)).join(' ')
                : 'Sin productos')
            : String(subgrupo.productos_ids || 'Sin productos'),
        segmentos_excluidos: Array.isArray(subgrupo.segmentos_excluidos)
            ? (subgrupo.segmentos_excluidos.length > 0
                ? subgrupo.segmentos_excluidos
                    .map(seg => {
                        const segmento = segmentosData.value.find(s => s.id === seg)
                        return segmento ? segmento.descripcion : String(seg)
                    })
                    .join(', ')
                : 'Sin segmentos excluidos')
            : 'Sin segmentos excluidos'
    }))
})

const loadSubgrupos = async (forceFromDatabase = false) => {
    try {
        if (props.formData.id) {
            if (!forceFromDatabase && props.formData.subgrupos && Array.isArray(props.formData.subgrupos) && props.formData.subgrupos.length > 0) {
                subgruposFromDb.value = props.formData.subgrupos
            } else {
                const response = await $fetch('/api/subgrupo-cat/subgrupo-cat')
                if (response.success) {
                    const filteredSubgrupos = response.subgrupos.filter(sub => sub.categoria_id === props.formData.id)
                    subgruposFromDb.value = filteredSubgrupos
                    
                    if (props.formData.subgrupos) {
                        props.formData.subgrupos = filteredSubgrupos
                    }
                } else {
                    subgruposFromDb.value = []
                }
            }
        } else {
            subgruposFromDb.value = props.formData.subgrupos || []
        }
    } catch (err) {
        console.error('Error cargando subgrupos:', err)
        subgruposFromDb.value = props.formData.subgrupos || []
    }
}

const openCreateModal = (event) => {
    if (event) {
        event.preventDefault()
        event.stopPropagation()
    }

    isEditingSubgrupo.value = false
    editingSubgrupoIndex.value = -1
    editingSubgrupoId.value = null
    modalSubgrupo.value = {
        nombre: '',
        nro_orden: (subgruposFromDb.value?.length || 0) + 1,
        productos_text: ''
    }
    modalErrors.value = {
        nombre: '',
        nro_orden: '',
        productos: ''
    }
    showModal.value = true
}

const handleEditSubgrupo = (subgrupo) => {
    nextTick(() => {
        editSubgrupo(subgrupo)
    })
}

const handleDeleteSubgrupo = (subgrupo) => {
    deleteSubgrupo(subgrupo)
}

const editSubgrupo = (subgrupo) => {
    const originalSubgrupo = subgruposFromDb.value.find(s => s.id === subgrupo.id)

    if (originalSubgrupo) {
        isEditingSubgrupo.value = true
        editingSubgrupoId.value = originalSubgrupo.id

        let nroOrden = originalSubgrupo.nro_orden
        if (typeof nroOrden === 'string') {
            nroOrden = parseInt(nroOrden) || 1
        }

        let productosText = ''
        if (Array.isArray(originalSubgrupo.productos_ids)) {
            productosText = originalSubgrupo.productos_ids.join(' ')
        } else if (originalSubgrupo.productos_ids) {
            productosText = String(originalSubgrupo.productos_ids)
        }

        modalSubgrupo.value = {
            nombre: originalSubgrupo.nombre || '',
            nro_orden: nroOrden,
            productos_text: productosText
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
    editingSubgrupoId.value = null
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

const saveSubgrupo = async () => {
    if (!validateSubgrupo()) {
        return
    }

    isSubmittingSubgrupo.value = true

    try {
        const productos_ids = modalSubgrupo.value.productos_text
            ? modalSubgrupo.value.productos_text
                .split(/\s+/)
                .map(id => id.trim())
                .filter(id => id.length > 0)
            : []

        if (isEditingSubgrupo.value) {
            const originalSubgrupo = subgruposFromDb.value.find(s => s.id === editingSubgrupoId.value)
            const categoriaId = props.formData.id || originalSubgrupo?.categoria_id

            const subgrupoData = {
                id: editingSubgrupoId.value,
                nombre: modalSubgrupo.value.nombre.trim(),
                categoria_id: categoriaId,
                nro_orden: parseInt(modalSubgrupo.value.nro_orden),
                productos_ids: productos_ids
            }


            if (!categoriaId) {
                error('No se pudo obtener el ID de la categoría')
                return
            }

            if (!editingSubgrupoId.value) {
                error('No se pudo obtener el ID del subgrupo')
                return
            }

            const response = await $fetch('/api/subgrupo-cat/update', {
                method: 'PUT',
                body: subgrupoData
            })


            if (response.success) {
                success('Subgrupo actualizado correctamente')
                
                await loadSubgrupos(true)
            } else {
                error(response.message || 'Error actualizando subgrupo')
            }
        } else {
            if (props.formData.id) {
                const subgrupoData = {
                    nombre: modalSubgrupo.value.nombre.trim(),
                    categoria_id: props.formData.id,
                    nro_orden: parseInt(modalSubgrupo.value.nro_orden),
                    productos_ids: productos_ids
                }

                const response = await $fetch('/api/subgrupo-cat/create', {
                    method: 'PUT',
                    body: subgrupoData
                })

                if (response.success) {
                    success('Subgrupo creado correctamente')

                    await loadSubgrupos(true)
                } else {
                    error(response.message || 'Error creando subgrupo')
                }
            } else {
                const subgrupoData = {
                    id: Date.now(),
                    nombre: modalSubgrupo.value.nombre.trim(),
                    nro_orden: parseInt(modalSubgrupo.value.nro_orden),
                    productos_ids: productos_ids
                }

                if (!props.formData.subgrupos) {
                    props.formData.subgrupos = []
                }

                props.formData.subgrupos.push(subgrupoData)
                
                await loadSubgrupos()
            }
        }

        closeModal()
    } catch (err) {
        console.error('Error guardando subgrupo:', err)
        error('Error guardando subgrupo')
    } finally {
        isSubmittingSubgrupo.value = false
    }
}

const deleteSubgrupo = async (subgrupo) => {
    isDeletingSubgrupo.value = true

    try {
        const response = await $fetch('/api/subgrupo-cat/delete', {
            method: 'DELETE',
            body: { id: subgrupo.id }
        })

        if (response.success) {
            success('Subgrupo eliminado correctamente')
            
            const index = subgruposFromDb.value.findIndex(s => s.id === subgrupo.id)
            if (index !== -1) {
                subgruposFromDb.value.splice(index, 1)
            }
            
            if (props.formData.subgrupos) {
                const formIndex = props.formData.subgrupos.findIndex(s => s.id === subgrupo.id)
                if (formIndex !== -1) {
                    props.formData.subgrupos.splice(formIndex, 1)
                }
            }
        } else {
            error(response.message || 'Error eliminando subgrupo')
        }
    } catch (err) {
        console.error('Error eliminando subgrupo:', err)
        error('Error eliminando subgrupo')
    } finally {
        isDeletingSubgrupo.value = false
    }
}

const handleSubmit = () => {
    emit('submit')
}

const onCategoriaCreated = async (result) => {
    if (result && result.success && result.categoria && result.categoria.id) {
        props.formData.id = result.categoria.id
        await loadSubgrupos()
    }
}

defineExpose({
    onCategoriaCreated
})

onMounted(async () => {
    try {
        const segmentos = await $fetch('/api/segmentos/segmentos')
        segmentosData.value = segmentos || []
    } catch (err) {
        console.error('Error cargando segmentos:', err)
        segmentosData.value = []
    }
    await loadSubgrupos()
})

watch(() => props.formData.id, async (newId) => {
    if (newId) {
        await loadSubgrupos()
    }
}, { immediate: true })

watch(() => props.formData.subgrupos, async (newSubgrupos) => {
    if (newSubgrupos && Array.isArray(newSubgrupos)) {
        await loadSubgrupos()
    }
}, { immediate: true, deep: true })
</script>
