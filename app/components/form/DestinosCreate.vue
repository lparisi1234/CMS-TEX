<template>
    <FormLayout v-if="tipo === 'ciudad'" @submit="handleSubmit" class="flex flex-col gap-5">
        <FormFieldsContainer>
            <FormTextField v-model="formData.nombre" label="Nombre" required
                placeholder="Ingresa el nombre de la ciudad" id="ciudad-nombre" :error="errors.nombre" />
            <FormSelectField v-model="formData.paises_id" label="País" required :options="paisesOptions"
                placeholder="Seleccionar país" :error="errors.paises_id" />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormSwitchField v-model="formData.estado" label="Estado" required :error="errors.estado" />
        </FormFieldsContainer>

        <div class="flex justify-center items-center flex-wrap gap-8 mt-3">
            <ButtonPrimary @click="$emit('cancel')" class="!bg-gray-mid !text-dark">
                Cancelar
            </ButtonPrimary>
            <ButtonPrimary type="submit" :disabled="isSubmitting">
                <span v-if="!isSubmitting">
                    {{ props.isEditing ? 'Actualizar' : 'Crear' }} Ciudad
                </span>
                <span v-else class="flex items-center gap-2">
                    <Icon name="tabler:loader-2" class="animate-spin" />
                    {{ props.isEditing ? 'Actualizando...' : 'Creando...' }}
                </span>
            </ButtonPrimary>
        </div>
    </FormLayout>

    <FormLayout v-else @submit="handleSubmit" class="flex flex-col gap-5">
        <TabsLayout :tabs="tabs">
            <template #detalle>
                <div class="flex flex-col gap-5">
                    <template v-for="chunk in detailsColumnChunks" :key="chunk[0].key">
                        <FormFieldsContainer>
                            <template v-for="column in chunk" :key="column.key">
                                <FormTextField v-if="column.type === 'text'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :error="errors[column.key]"
                                    :placeholder="`Ingresa ${column.label.toLowerCase()}`" />

                                <FormTextareaField v-else-if="column.type === 'textarea'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :error="errors[column.key]"
                                    :placeholder="column.placeholder || `Ingresa ${column.label.toLowerCase()}`"
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
                                    :error="errors[column.key]" targetFolder="destinos" :size="column.size" />

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
                    <TableLayout :data="masVendidosDisplay" :columns="tablasEspecialesColumns"
                        :table-name="'Más Vendidos'" :show-actions="true" :empty-state-text="''"
                        @edit="handleEditTablaEspecial('masVendidos', $event)">
                        <template #row-actions="{ item }">
                            <div class="flex justify-center items-center gap-2">
                                <button type="button" @click.prevent.stop="handleEditTablaEspecial('masVendidos', item)"
                                    title="Editar">
                                    <Icon name="tabler:edit" class="w-6 h-6 text-violet" />
                                </button>
                            </div>
                        </template>
                    </TableLayout>

                    <TableLayout :data="vueloIncluidoDisplay" :columns="tablasEspecialesColumns"
                        :table-name="'Vuelo Incluido'" :show-actions="true" :empty-state-text="''"
                        @edit="handleEditTablaEspecial('vueloIncluido', $event)">
                        <template #row-actions="{ item }">
                            <div class="flex justify-center items-center gap-2">
                                <button type="button"
                                    @click.prevent.stop="handleEditTablaEspecial('vueloIncluido', item)" title="Editar">
                                    <Icon name="tabler:edit" class="w-6 h-6 text-violet" />
                                </button>
                            </div>
                        </template>
                    </TableLayout>

                    <TableLayout :data="recomendadosDisplay" :columns="tablasEspecialesColumns"
                        :table-name="'Recomendados'" :show-actions="true" :empty-state-text="''"
                        @edit="handleEditTablaEspecial('recomendados', $event)">
                        <template #row-actions="{ item }">
                            <div class="flex justify-center items-center gap-2">
                                <button type="button"
                                    @click.prevent.stop="handleEditTablaEspecial('recomendados', item)" title="Editar">
                                    <Icon name="tabler:edit" class="w-6 h-6 text-violet" />
                                </button>
                            </div>
                        </template>
                    </TableLayout>

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

    <Teleport to="body">
        <div v-if="showTablaEspecialModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click="handleTablaEspecialModalBackgroundClick">
            <div class="w-full max-w-[56rem] flex flex-col gap-6 bg-light rounded-[20px] p-12" @click.stop>
                <HeadingH2 class="text-center">
                    Editar {{ currentTablaEspecialName }}
                </HeadingH2>

                <div class="flex flex-col gap-4">
                    <FormFieldsContainer>
                        <FormTextareaField id="tabla-especial-productos" v-model="modalTablaEspecial.productos_text"
                            label="Productos (IDs separados por espacios)"
                            placeholder="Ej: 3/2500254 3/2500298 3/2500314" :rows="5" />
                    </FormFieldsContainer>

                    <div class="flex justify-center gap-5 mt-2">
                        <ButtonPrimary @click.prevent.stop="closeTablaEspecialModal" type="button"
                            class="!bg-gray-mid !text-dark">
                            Cancelar
                        </ButtonPrimary>
                        <ButtonPrimary @click.prevent.stop="saveTablaEspecial" type="button">
                            Actualizar
                        </ButtonPrimary>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
const { success, error } = useNotification()

const props = defineProps({
    tipo: {
        type: String,
        default: 'destino',
        validator: (value) => ['destino', 'region', 'pais', 'ciudad'].includes(value)
    },
    isEditing: {
        type: Boolean,
        default: false
    },
    editingData: {
        type: Object,
        default: null
    },
    formData: {
        type: Object,
        required: false,
        default: () => ({})
    },
    errors: {
        type: Object,
        required: false,
        default: () => ({})
    },
    selectOptions: {
        type: Object,
        required: false,
        default: () => ({})
    },
    loadingOptions: {
        type: Object,
        required: false,
        default: () => ({})
    },
    badgeOptions: {
        type: Array,
        required: false,
        default: () => []
    },
    isSubmitting: {
        type: Boolean,
        default: false
    },
    botonTexto: {
        type: String,
        default: 'Crear destino'
    },
    detailsColumns: {
        type: Array,
        required: false,
        default: () => []
    }
})

const emit = defineEmits(['submit', 'success', 'cancel'])

const destinosData = ref([])
const expertosData = ref([])
const segmentosData = ref([])
const masVendidosData = ref([])
const vueloIncluidoData = ref([])
const recomendadosData = ref([])

const loadData = async () => {
    try {
        const [destinos, expertos, segmentos, masVendidos, vueloIncluido, recomendados] = await Promise.all([
            $fetch('/api/destinos/destinos'),
            $fetch('/api/expertos/expertos'),
            $fetch('/api/segmentos/segmentos'),
            $fetch('/api/masVendidos/masVendidos').catch(() => []),
            $fetch('/api/vueloIncluido/vueloIncluido').catch(() => []),
            $fetch('/api/recomendados/recomendados').catch(() => [])
        ])

        destinosData.value = destinos || []
        expertosData.value = expertos || []
        segmentosData.value = segmentos || []
        masVendidosData.value = masVendidos || []
        vueloIncluidoData.value = vueloIncluido || []
        recomendadosData.value = recomendados || []
    } catch (err) {
        console.error('Error cargando datos:', err)
        error('Error al cargar los datos')
    }
}

const initFormData = () => {
    const baseData = {
        nombre: '',
        estado: true
    }

    if (props.tipo === 'ciudad') {
        return {
            ...baseData,
            paises_id: ''
        }
    }

    const fullData = {
        ...baseData,
        id: null,
        cod_newton: '',
        url: '',
        h1: '',
        h2: '',
        img: '',
        video_mobile: '',
        video_desktop: '',
        experto_id: '',
        consejo_experto: '',
        meta_titulo: '',
        meta_descripcion: '',
        meta_keywords: '',
        mapa: '',
        nro_orden: '',
        precio_desde: '',
        masVendidos: [],
        vueloIncluido: [],
        recomendados: [],
        subgrupos: [],
        segmentos_excluidos: []
    }

    if (props.tipo === 'pais') {
        fullData.region_id = ''
    }

    return fullData
}

const formData = ref(initFormData())
const errors = ref({})
const isSubmitting = ref(false)
const selectOptions = ref({})
const loadingOptions = ref({})

const tabs = [
    { id: 'detalle', label: 'Detalle' },
    { id: 'subgrupos', label: 'Subgrupos' }
]

const detailsColumns = [
    { key: 'cod_newton', label: 'Código Newton', type: 'number', required: true },
    ...(props.tipo === 'pais' ? [{ key: 'region_id', label: 'Región', type: 'select', required: true, }] : []),
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'url', label: 'URL', type: 'text' },
    { key: 'h1', label: 'H1', type: 'text' },
    { key: 'h2', label: 'H2', type: 'text' },
    { key: 'meta_titulo', label: 'Meta Título', type: 'text' },
    { key: 'meta_descripcion', label: 'Meta Descripción', type: 'text' },
    { key: 'meta_keywords', label: 'Meta Keywords', type: 'text' },
    { key: 'estado', label: 'Estado', type: 'boolean', required: true },
    { key: 'mapa', label: 'Coordenadas del Mapa', type: 'text' },
    { key: 'img', label: 'Imagen', type: 'image', size: '650px x 360px' },
    { key: 'video_mobile', label: 'Video Mobile', type: 'image', size: '510px x 260px' },
    { key: 'video_desktop', label: 'Video Desktop', type: 'image', size: '670px x 460px' },
    { key: 'nro_orden', label: 'Número de Orden', type: 'number' },
    { key: 'precio_desde', label: 'Precio Desde', type: 'currency' },
    { key: 'experto_id', label: 'Experto', type: 'select' },
    { key: 'consejo_experto', label: 'Consejo del Experto', type: 'textarea', fullWidth: true },
    { key: 'nombre_alternativo', label: 'Nombres Alternativos', type: 'textarea', fullWidth: true },
]

const detailsColumnChunks = computed(() => {
    if (props.tipo === 'ciudad') return []

    const filteredColumns = detailsColumns.filter(column => column.key !== 'subgrupos')
    const chunkSize = 2
    const chunks = []
    for (let i = 0; i < filteredColumns.length; i += chunkSize) {
        chunks.push(filteredColumns.slice(i, i + chunkSize))
    }
    return chunks
})

const expertosOptions = computed(() => {
    return expertosData.value.map(experto => ({
        value: experto.id,
        label: experto.nombre
    }))
})

const segmentosOptions = computed(() => {
    return segmentosData.value.map(segmento => ({
        value: segmento.id,
        label: segmento.descripcion
    }))
})

const regionesOptions = computed(() => {
    return destinosData.value
        .filter(destino => !destino.region_id)
        .map(region => ({
            value: region.id,
            label: region.nombre
        }))
})

const paisesOptions = computed(() => {
    return destinosData.value
        .filter(destino => destino.region_id)
        .map(pais => ({
            value: pais.id,
            label: pais.nombre
        }))
})

const setupSelectOptions = () => {
    selectOptions.value.experto_id = expertosOptions.value
    if (props.tipo === 'pais') {
        selectOptions.value.region_id = regionesOptions.value
    }
}

const botonTexto = computed(() => {
    const action = props.isEditing ? 'Actualizar' : 'Crear'
    const typeMap = {
        region: 'Región',
        pais: 'País',
        ciudad: 'Ciudad',
        destino: 'Destino'
    }
    return `${action} ${typeMap[props.tipo] || 'Destino'}`
})

const tablasEspecialesColumns = [
    { key: 'nombre', label: 'Nombre', type: 'text' },
    { key: 'productos', label: 'Productos', type: 'text' }
]

const getTablaEspecialData = (tipo, destinoId) => {
    let sourceData = []
    switch (tipo) {
        case 'masVendidos':
            sourceData = masVendidosData.value
            break
        case 'vueloIncluido':
            sourceData = vueloIncluidoData.value
            break
        case 'recomendados':
            sourceData = recomendadosData.value
            break
    }

    if (!Array.isArray(sourceData)) return []
    return sourceData
        .filter(item => item.destino_id === destinoId)
        .map(item => item.ProductoId)
}

const masVendidosDisplay = computed(() => {
    let productos = formData.value.masVendidos || []

    if (props.isEditing && productos.length === 0 && props.editingData?.id) {
        productos = getTablaEspecialData('masVendidos', props.editingData.id)
    }

    return [{
        id: 'masVendidos',
        nombre: 'Más Vendidos',
        productos: productos.length > 0 ? productos.join(' ') : ''
    }]
})

const vueloIncluidoDisplay = computed(() => {
    let productos = formData.value.vueloIncluido || []

    if (props.isEditing && productos.length === 0 && props.editingData?.id) {
        productos = getTablaEspecialData('vueloIncluido', props.editingData.id)
    }

    return [{
        id: 'vueloIncluido',
        nombre: 'Vuelo Incluido',
        productos: productos.length > 0 ? productos.join(' ') : ''
    }]
})

const recomendadosDisplay = computed(() => {
    let productos = formData.value.recomendados || []

    if (props.isEditing && productos.length === 0 && props.editingData?.id) {
        productos = getTablaEspecialData('recomendados', props.editingData.id)
    }

    return [{
        id: 'recomendados',
        nombre: 'Recomendados',
        productos: productos.length > 0 ? productos.join(' ') : ''
    }]
})

const showTablaEspecialModal = ref(false)
const currentTablaEspecial = ref('')
const currentTablaEspecialName = ref('')
const modalTablaEspecial = ref({
    productos_text: ''
})

const handleEditTablaEspecial = (tipo, item) => {
    currentTablaEspecial.value = tipo
    currentTablaEspecialName.value = item.nombre

    if (props.isEditing && props.editingData?.id) {
        if (!formData.value.masVendidos || formData.value.masVendidos.length === 0) {
            formData.value.masVendidos = masVendidosData.value
                .filter(item => item.destino_id === props.editingData.id)
                .map(item => item.ProductoId)
        }

        if (!formData.value.vueloIncluido || formData.value.vueloIncluido.length === 0) {
            formData.value.vueloIncluido = vueloIncluidoData.value
                .filter(item => item.destino_id === props.editingData.id)
                .map(item => item.ProductoId)
        }

        if (!formData.value.recomendados || formData.value.recomendados.length === 0) {
            formData.value.recomendados = recomendadosData.value
                .filter(item => item.destino_id === props.editingData.id)
                .map(item => item.ProductoId)
        }
    }

    modalTablaEspecial.value.productos_text = formData.value[tipo]?.join(' ') || ''
    showTablaEspecialModal.value = true
}

const closeTablaEspecialModal = () => {
    showTablaEspecialModal.value = false
    currentTablaEspecial.value = ''
    currentTablaEspecialName.value = ''
    modalTablaEspecial.value.productos_text = ''
}

const handleTablaEspecialModalBackgroundClick = (event) => {
    if (event.target === event.currentTarget) {
        closeTablaEspecialModal()
    }
}

const saveTablaEspecial = () => {
    const nuevosProductos = modalTablaEspecial.value.productos_text
        ? modalTablaEspecial.value.productos_text
            .split(/\s+/)
            .map(id => id.trim())
            .filter(id => id.length > 0)
        : []

    switch (currentTablaEspecial.value) {
        case 'masVendidos':
            formData.value = {
                ...formData.value,
                masVendidos: nuevosProductos,
                _masVendidosModified: true
            }
            break
        case 'vueloIncluido':
            formData.value = {
                ...formData.value,
                vueloIncluido: nuevosProductos,
                _vueloIncluidoModified: true
            }
            break
        case 'recomendados':
            formData.value = {
                ...formData.value,
                recomendados: nuevosProductos,
                _recomendadosModified: true
            }
            break
    }

    closeTablaEspecialModal()
}

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

const subgruposFromDb = ref([])

const displaySubgrupos = computed(() => {
    const subgrupos = subgruposFromDb.value || []

    if (!Array.isArray(subgrupos)) {
        return []
    }

    return subgrupos.map(subgrupo => ({
        ...subgrupo,
        productos: Array.isArray(subgrupo.productos_codigos)
            ? (subgrupo.productos_codigos.length > 0
                ? subgrupo.productos_codigos.join(' ')
                : 'Sin productos')
            : 'Sin productos',
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
        if (formData.value.id) {
            if (!forceFromDatabase && formData.value.subgrupos && Array.isArray(formData.value.subgrupos) && formData.value.subgrupos.length > 0) {
                subgruposFromDb.value = formData.value.subgrupos
            } else {
                const response = await $fetch('/api/subgrupo-dst/subgrupo-dst')
                if (response.success) {
                    const filteredSubgrupos = response.subgrupos.filter(sub => sub.destino_id === formData.value.id)
                    subgruposFromDb.value = filteredSubgrupos

                    if (formData.value.subgrupos) {
                        formData.value.subgrupos = filteredSubgrupos
                    }
                } else {
                    subgruposFromDb.value = []
                }
            }
        } else {
            subgruposFromDb.value = formData.value.subgrupos || []
        }
    } catch (err) {
        console.error('Error cargando subgrupos:', err)
        subgruposFromDb.value = formData.value.subgrupos || []
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

    if (!originalSubgrupo) return

    isEditingSubgrupo.value = true
    editingSubgrupoId.value = originalSubgrupo.id

    const nroOrden = typeof originalSubgrupo.nro_orden === 'string'
        ? parseInt(originalSubgrupo.nro_orden) || 1
        : originalSubgrupo.nro_orden

    let productosText = ''
    if (Array.isArray(originalSubgrupo.productos_codigos)) {
        productosText = originalSubgrupo.productos_codigos.join(' ')
    } else if (originalSubgrupo.productos_codigos) {
        productosText = String(originalSubgrupo.productos_codigos)
    }

    // Asegurar que segmentos_excluidos sea un array de números
    const segmentosExcluidos = Array.isArray(originalSubgrupo.segmentos_excluidos) 
        ? originalSubgrupo.segmentos_excluidos.map(seg => parseInt(seg)).filter(seg => !isNaN(seg))
        : (Array.isArray(originalSubgrupo.segmentos_id) 
            ? originalSubgrupo.segmentos_id.map(seg => parseInt(seg)).filter(seg => !isNaN(seg))
            : [])

    modalSubgrupo.value = {
        nombre: originalSubgrupo.nombre || '',
        nro_orden: nroOrden,
        productos_text: productosText,
        segmentos_excluidos: segmentosExcluidos
    }

    modalErrors.value = {
        nombre: '',
        nro_orden: '',
        productos: ''
    }

    showModal.value = true
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

        // Convertir segmentos_excluidos a array de números
        const segmentos_excluidos = Array.isArray(modalSubgrupo.value.segmentos_excluidos)
            ? modalSubgrupo.value.segmentos_excluidos.map(seg => parseInt(seg)).filter(seg => !isNaN(seg))
            : []

        if (isEditingSubgrupo.value) {
            const originalSubgrupo = subgruposFromDb.value.find(s => s.id === editingSubgrupoId.value)
            const destinoId = formData.value.id || originalSubgrupo?.destino_id

            const subgrupoData = {
                id: editingSubgrupoId.value,
                nombre: modalSubgrupo.value.nombre.trim(),
                destino_id: destinoId,
                nro_orden: parseInt(modalSubgrupo.value.nro_orden),
                productos_ids: productos_ids,
                segmentos_excluidos: segmentos_excluidos
            }

            if (!destinoId) {
                error('No se pudo obtener el ID del destino')
                return
            }

            if (!editingSubgrupoId.value) {
                error('No se pudo obtener el ID del subgrupo')
                return
            }

            const response = await $fetch('/api/subgrupo-dst/update', {
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
            if (formData.value.id) {
                const subgrupoData = {
                    nombre: modalSubgrupo.value.nombre.trim(),
                    destino_id: formData.value.id,
                    nro_orden: parseInt(modalSubgrupo.value.nro_orden),
                    productos_ids: productos_ids,
                    segmentos_excluidos: segmentos_excluidos
                }

                const response = await $fetch('/api/subgrupo-dst/create', {
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
                // Cuando el destino aún no está guardado
                const subgrupoData = {
                    id: Date.now(),
                    nombre: modalSubgrupo.value.nombre.trim(),
                    nro_orden: parseInt(modalSubgrupo.value.nro_orden),
                    productos_ids: productos_ids,
                    productos_codigos: productos_ids,
                    segmentos_excluidos: segmentos_excluidos
                }

                if (!formData.value.subgrupos) {
                    formData.value.subgrupos = []
                }

                formData.value.subgrupos.push(subgrupoData)
                
                // Actualizar directamente subgruposFromDb sin recargar
                subgruposFromDb.value = [...formData.value.subgrupos]
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
        const response = await $fetch('/api/subgrupo-dst/delete', {
            method: 'DELETE',
            body: { id: subgrupo.id }
        })

        if (response.success) {
            success('Subgrupo eliminado correctamente')

            const index = subgruposFromDb.value.findIndex(s => s.id === subgrupo.id)
            if (index !== -1) {
                subgruposFromDb.value.splice(index, 1)
            }

            if (formData.value.subgrupos) {
                const formIndex = formData.value.subgrupos.findIndex(s => s.id === subgrupo.id)
                if (formIndex !== -1) {
                    formData.value.subgrupos.splice(formIndex, 1)
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

const handleSubmit = async () => {
    if (props.tipo === 'ciudad') {
        if (!formData.value.nombre || !formData.value.paises_id) {
            error('Por favor completa todos los campos requeridos')
            return
        }

        isSubmitting.value = true

        try {
            const ciudadData = {
                ...formData.value,
                estado: formData.value.estado ? 1 : 0,
                paises_id: parseInt(formData.value.paises_id)
            }

            if (props.isEditing && props.editingData?.id) {
                await $fetch('/api/ciudades/update', {
                    method: 'PUT',
                    body: { ...ciudadData, id: props.editingData.id }
                })
                success('Ciudad actualizada correctamente')
            } else {
                await $fetch('/api/ciudades/create', {
                    method: 'PUT',
                    body: ciudadData
                })
                success('Ciudad creada correctamente')
            }

            emit('success')
        } catch (err) {
            console.error('Error:', err)
            error('Error al procesar la ciudad')
        } finally {
            isSubmitting.value = false
        }
    } else {
        if (!formData.value.nombre || !formData.value.cod_newton) {
            error('Por favor completa todos los campos requeridos')
            return
        }


        isSubmitting.value = true

        try {
            const destinoData = {
                ...formData.value,
                estado: formData.value.estado ? 1 : 0,
                cod_newton: formData.value.cod_newton ? parseInt(formData.value.cod_newton) : null,
                nro_orden: formData.value.nro_orden ? parseInt(formData.value.nro_orden) : null,
                precio_desde: (formData.value.precio_desde && formData.value.precio_desde !== '') ? parseFloat(formData.value.precio_desde) : null,
                experto_id: formData.value.experto_id ? parseInt(formData.value.experto_id) : null,
                region_id: formData.value.region_id ? parseInt(formData.value.region_id) : null,
                subgrupos: formData.value.subgrupos || []
            }

            if (formData.value._masVendidosModified) {
                destinoData.masVendidos = formData.value.masVendidos || []
            }
            if (formData.value._vueloIncluidoModified) {
                destinoData.vueloIncluido = formData.value.vueloIncluido || []
            }
            if (formData.value._recomendadosModified) {
                destinoData.recomendados = formData.value.recomendados || []
            }

            delete destinoData._masVendidosModified
            delete destinoData._vueloIncluidoModified
            delete destinoData._recomendadosModified

            if (props.isEditing && props.editingData?.id) {
                destinoData.id = props.editingData.id
                await $fetch('/api/destinos/update', {
                    method: 'PUT',
                    body: destinoData
                })
                success('Destino actualizado correctamente')
            } else {
                const result = await $fetch('/api/destinos/create', {
                    method: 'PUT',
                    body: destinoData
                })
                if (result && result.success && result.destino && result.destino.id) {
                    formData.value.id = result.destino.id
                    await nextTick()
                    await loadSubgrupos(true)
                    await nextTick()
                }

                success('Destino creado correctamente')
            }

            emit('success')
        } catch (err) {
            console.error('Error:', err)
            error('Error al procesar el destino')
        } finally {
            isSubmitting.value = false
        }
    }
}

const onDestinoCreated = async (result) => {
    if (result && result.success && result.destino && result.destino.id) {
        formData.value.id = result.destino.id
        await loadSubgrupos()
    }
}

defineExpose({
    onDestinoCreated
})

onMounted(async () => {
    await loadData()
    await nextTick()
    setupSelectOptions()
    await loadSubgrupos()
})

watch(() => props.editingData, (newData) => {
    if (newData && props.isEditing) {
        Object.keys(formData.value).forEach(key => {
            if (newData.hasOwnProperty(key)) {
                if (key === 'estado') {
                    formData.value[key] = newData[key] == 1 || newData[key] === true
                } else if (key === 'region_id') {
                    formData.value[key] = newData.region_id || ''
                } else if (key === 'id') {
                    formData.value[key] = newData[key]
                } else {
                    formData.value[key] = newData[key] || ''
                }
            }
        })

        if (newData.id) {
            formData.value.id = newData.id
        }

        if (newData.subgrupos) {
            formData.value.subgrupos = newData.subgrupos
            loadSubgrupos()
        }
    }
}, { immediate: true })

watch(() => formData.value.subgrupos, async (newSubgrupos) => {
    if (newSubgrupos && Array.isArray(newSubgrupos)) {
        await loadSubgrupos()
    }
}, { immediate: true, deep: true })
</script>