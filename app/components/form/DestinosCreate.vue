<template>
    <FormLayout v-if="tipo === 'ciudad'" @submit="handleSubmit" class="flex flex-col gap-5">
        <FormFieldsContainer>
            <FormTextField v-model="formData.nombre" label="Nombre" required
                placeholder="Ingresa el nombre de la ciudad" id="ciudad-nombre" />
            <FormSelectField v-model="formData.paises_id" label="País" required :options="paisesOptions"
                placeholder="Seleccionar país" />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormSelectField v-model="formData.estado" label="Estado" required :options="badgeOptions"
                placeholder="Seleccionar estado" />
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
                    <template v-for="(chunk, chunkIndex) in detailsColumnChunks" :key="`chunk-${chunkIndex}`">
                        <FormFieldsContainer v-if="chunk.length === 1">
                            <template v-for="column in chunk" :key="column.key">
                                <FormTextField v-if="column.type === 'text'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :placeholder="`Ingresa ${column.label.toLowerCase()}`" />

                                <FormTextareaField v-else-if="column.type === 'textarea'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :placeholder="`Ingresa ${column.label.toLowerCase()}`" :rows="4" />

                                <FormSelectField v-else-if="column.type === 'select'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :options="selectOptions[column.key] || []"
                                    :placeholder="`Selecciona ${column.label.toLowerCase()}`" />

                                <FormSelectField v-else-if="column.type === 'badge'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :options="badgeOptions"
                                    :placeholder="`Seleccionar ${column.label.toLowerCase()}`" />

                                <FormImageField v-else-if="column.type === 'image'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required" />

                                <FormTextField v-else-if="column.type === 'number'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    type="number" :placeholder="`Ingresa ${column.label.toLowerCase()}`" />

                                <FormTextField v-else-if="column.type === 'currency'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    type="number" step="0.01" :placeholder="`Ingresa ${column.label.toLowerCase()}`" />
                            </template>
                        </FormFieldsContainer>
                        <FormFieldsContainer v-else>
                            <template v-for="column in chunk" :key="column.key">
                                <FormTextField v-if="column.type === 'text'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :placeholder="`Ingresa ${column.label.toLowerCase()}`" />

                                <FormTextareaField v-else-if="column.type === 'textarea'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :placeholder="`Ingresa ${column.label.toLowerCase()}`" :rows="4" />

                                <FormSelectField v-else-if="column.type === 'select'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :options="selectOptions[column.key] || []"
                                    :placeholder="`Selecciona ${column.label.toLowerCase()}`" />

                                <FormSelectField v-else-if="column.type === 'badge'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    :options="badgeOptions"
                                    :placeholder="`Seleccionar ${column.label.toLowerCase()}`" />

                                <FormImageField v-else-if="column.type === 'image'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required" />

                                <FormTextField v-else-if="column.type === 'number'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    type="number" :placeholder="`Ingresa ${column.label.toLowerCase()}`" />

                                <FormTextField v-else-if="column.type === 'currency'" :id="`field-${column.key}`"
                                    v-model="formData[column.key]" :label="column.label" :required="column.required"
                                    type="number" step="0.01" :placeholder="`Ingresa ${column.label.toLowerCase()}`" />
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
        <div class="w-full max-w-[56rem] flex flex-col gap-6 bg-light rounded-[20px] p-12" @click.stop>
            <HeadingH2 class="text-center">
                {{ isEditingSubgrupo ? 'Editar Subgrupo' : 'Crear Subgrupo' }}
            </HeadingH2>

            <form @submit.prevent="saveSubgrupo" class="flex flex-col gap-4">
                <FormFieldsContainer>
                    <FormTextField id="modal-nombre" v-model="modalSubgrupo.nombre" label="Nombre del Subgrupo"
                        placeholder="Ingresa el nombre del subgrupo" :required="true" />

                    <FormTextField id="modal-orden" v-model="modalSubgrupo.nro_orden" label="Número de Orden"
                        type="number" placeholder="Ingresa el orden" :required="true" />
                </FormFieldsContainer>

                <FormFieldsContainer>
                    <FormTextareaField id="modal-productos" v-model="modalSubgrupo.productos_text"
                        label="Productos (IDs separados por espacios)" placeholder="Ej: 3/2500254 3/2500298 3/2500314"
                        :rows="3" />
                </FormFieldsContainer>

                <div class="flex justify-center gap-5 mt-2">
                    <ButtonPrimary @click.prevent="closeModal" type="button" class="!bg-gray-mid !text-dark">
                        Cancelar
                    </ButtonPrimary>
                    <ButtonPrimary type="submit">
                        {{ isEditingSubgrupo ? 'Actualizar' : 'Crear' }}
                    </ButtonPrimary>
                </div>
            </form>
        </div>
    </div>

    <div v-if="showTablaEspecialModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="handleTablaEspecialModalBackgroundClick">
        <div class="w-full max-w-[56rem] flex flex-col gap-6 bg-light rounded-[20px] p-12" @click.stop>
            <HeadingH2 class="text-center">
                Editar {{ currentTablaEspecialName }}
            </HeadingH2>

            <form @submit.prevent="saveTablaEspecial" class="flex flex-col gap-4">
                <FormFieldsContainer>
                    <FormTextareaField id="tabla-especial-productos" v-model="modalTablaEspecial.productos_text"
                        label="Productos (IDs separados por espacios)" placeholder="Ej: 3/2500254 3/2500298 3/2500314"
                        :rows="5" />
                </FormFieldsContainer>

                <div class="flex justify-center gap-5 mt-2">
                    <ButtonPrimary @click.prevent="closeTablaEspecialModal" type="button"
                        class="!bg-gray-mid !text-dark">
                        Cancelar
                    </ButtonPrimary>
                    <ButtonPrimary type="submit">
                        Actualizar
                    </ButtonPrimary>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
const { success, error } = useNotification()

const badgeOptions = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'borrador', label: 'Borrador' },
]

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
    }
})

const emit = defineEmits(['success', 'cancel'])

// Datos reactivos para endpoints
const destinosData = ref([])
const expertosData = ref([])
const masVendidosData = ref([])
const vueloIncluidoData = ref([])
const recomendadosData = ref([])

// Cargar datos desde endpoints
const loadData = async () => {
    try {
        const [destinos, expertos, masVendidos, vueloIncluido, recomendados] = await Promise.all([
            $fetch('/api/destinos/destinos'),
            $fetch('/api/expertos/expertos'),
            $fetch('/api/mas-vendidos/mas-vendidos').catch(() => []),
            $fetch('/api/vuelo-incluido/vuelo-incluido').catch(() => []),
            $fetch('/api/recomendados/recomendados').catch(() => [])
        ])
        
        destinosData.value = destinos || []
        expertosData.value = expertos || []
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
        estado: 'activo'
    }

    if (props.tipo === 'ciudad') {
        return {
            ...baseData,
            paises_id: ''
        }
    }

    const fullData = {
        ...baseData,
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
        desde_precio: '',
        masVendidos: [],
        vueloIncluido: [],
        recomendados: [],
        subgrupos: []
    }

    if (props.tipo === 'pais') {
        fullData.regionId = ''
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
    { key: 'codigo_newton', label: 'Código Newton', type: 'number', required: true },
    ...(props.tipo === 'pais' ? [{ key: 'regionId', label: 'Región', type: 'select', required: true, }] : []),
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'url', label: 'URL', type: 'text' },
    { key: 'h1', label: 'H1', type: 'text' },
    { key: 'h2', label: 'H2', type: 'text' },
    { key: 'meta_titulo', label: 'Meta Título', type: 'text' },
    { key: 'meta_descripcion', label: 'Meta Descripción', type: 'text' },
    { key: 'meta_keywords', label: 'Meta Keywords', type: 'text' },
    { key: 'estado', label: 'Estado', type: 'badge', required: true },
    { key: 'mapa', label: 'Coordenadas del Mapa', type: 'text' },
    { key: 'img', label: 'Imagen', type: 'image' },
    { key: 'video_mobile', label: 'Video Mobile', type: 'image' },
    { key: 'video_desktop', label: 'Video Desktop', type: 'image' },
    { key: 'nro_orden', label: 'Número de Orden', type: 'number' },
    { key: 'experto_id', label: 'Experto', type: 'select' },
    { key: 'consejo_experto', label: 'Consejo del Experto', type: 'textarea', fullWidth: true },
]

const detailsColumnChunks = computed(() => {
    if (props.tipo === 'ciudad') return []

    const chunks = []

    for (let i = 0; i < detailsColumns.length; i++) {
        const column = detailsColumns[i]

        if (column.fullWidth) {
            chunks.push([column])
        } else {
            if (chunks.length === 0 || chunks[chunks.length - 1].length === 2 || chunks[chunks.length - 1][0].fullWidth) {
                chunks.push([column])
            } else {
                chunks[chunks.length - 1].push(column)
            }
        }
    }

    return chunks
})

const expertosOptions = computed(() => {
    return expertosData.value.map(experto => ({
        value: experto.id,
        label: experto.nombre
    }))
})

const regionesOptions = computed(() => {
    return destinosData.value
        .filter(destino => !destino.regionId)
        .map(region => ({
            value: region.id,
            label: region.nombre
        }))
})

const paisesOptions = computed(() => {
    return destinosData.value
        .filter(destino => destino.regionId)
        .map(pais => ({
            value: pais.id,
            label: pais.nombre
        }))
})

const setupSelectOptions = () => {
    selectOptions.value = {
        experto_id: expertosOptions.value,
        ...(props.tipo === 'pais' && { regionId: regionesOptions.value })
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

    const found = sourceData.find(item => item.destino_id === destinoId)
    return found ? found.productos : []
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

    let productos = formData.value[tipo] || []

    if (props.isEditing && productos.length === 0 && props.editingData?.id) {
        productos = getTablaEspecialData(tipo, props.editingData.id)
        formData.value[tipo] = productos
    }

    modalTablaEspecial.value.productos_text = productos.join(' ')
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
    const productos = modalTablaEspecial.value.productos_text
        ? modalTablaEspecial.value.productos_text
            .split(/\s+/)
            .map(id => id.trim())
            .filter(id => id.length > 0)
        : []

    formData.value[currentTablaEspecial.value] = productos
    closeTablaEspecialModal()
}

const showModal = ref(false)
const isEditingSubgrupo = ref(false)
const editingSubgrupoIndex = ref(-1)
const modalSubgrupo = ref({
    nombre: '',
    nro_orden: 1,
    productos_text: ''
})

const subgruposColumns = [
    { key: 'nombre', label: 'Subgrupo', type: 'text', required: true },
    { key: 'nro_orden', label: 'Número de Orden', type: 'number', required: true },
    { key: 'productos', label: 'Productos', type: 'array-ids', required: false }
]

const displaySubgrupos = computed(() => {
    const subgrupos = formData.value.subgrupos || []

    if (!Array.isArray(subgrupos)) {
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
        nro_orden: (formData.value.subgrupos?.length || 0) + 1,
        productos_text: ''
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
    const index = formData.value.subgrupos.findIndex(s => s.id === subgrupo.id)
    if (index !== -1) {
        isEditingSubgrupo.value = true
        editingSubgrupoIndex.value = index

        const originalSubgrupo = formData.value.subgrupos[index]

        modalSubgrupo.value = {
            nombre: originalSubgrupo.nombre || '',
            nro_orden: originalSubgrupo.nro_orden || 1,
            productos_text: Array.isArray(originalSubgrupo.productos)
                ? originalSubgrupo.productos.join(' ')
                : (originalSubgrupo.productos || '')
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
}

const handleModalBackgroundClick = (event) => {
    if (event.target === event.currentTarget) {
        closeModal()
    }
}

const saveSubgrupo = () => {
    if (!modalSubgrupo.value.nombre.trim()) return

    const productos = modalSubgrupo.value.productos_text
        ? modalSubgrupo.value.productos_text
            .split(/\s+/)
            .map(id => id.trim())
            .filter(id => id.length > 0)
        : []

    const subgrupoData = {
        id: isEditingSubgrupo.value
            ? formData.value.subgrupos[editingSubgrupoIndex.value].id
            : Date.now(),
        nombre: modalSubgrupo.value.nombre.trim(),
        nro_orden: parseInt(modalSubgrupo.value.nro_orden),
        productos: productos
    }

    if (!formData.value.subgrupos) {
        formData.value.subgrupos = []
    }

    if (isEditingSubgrupo.value) {
        formData.value.subgrupos[editingSubgrupoIndex.value] = subgrupoData
    } else {
        formData.value.subgrupos.push(subgrupoData)
    }

    closeModal()
}

const deleteSubgrupo = (subgrupo) => {
    const index = formData.value.subgrupos.findIndex(s => s.id === subgrupo.id)
    if (index !== -1) {
        formData.value.subgrupos.splice(index, 1)
        formData.value.subgrupos.forEach((sub, idx) => {
            sub.nro_orden = idx + 1
        })
    }
}

const handleSubmit = async () => {
    isSubmitting.value = true

    try {
        const dataToSubmit = { ...formData.value }

        if (props.tipo === 'region') {
            delete dataToSubmit.regionId
        }

        if (!props.isEditing) {
            dataToSubmit.masVendidos = ['3/2500254', '3/2500298', '3/2500314', '3/2505535', '3/2505171', '2/61478', '2/61477']
            dataToSubmit.vueloIncluido = ['3/2500254', '3/2500298', '3/2500314', '3/2505535', '3/2505171', '2/61478', '2/61477']
            dataToSubmit.recomendados = ['3/2500254', '3/2500298', '3/2500314', '3/2505535', '3/2505171', '2/61478', '2/61477']

            if (dataToSubmit.subgrupos.length === 0) {
                dataToSubmit.subgrupos = [
                    {
                        id: 1,
                        nombre: 'Viajes por España, Italia y Francia',
                        nro_orden: 1,
                        productos: ['3/2500254', '3/2500298', '3/2500314', '3/2505535', '3/2505171', '2/61478', '2/61477']
                    }
                ]
            }
        }

        if (props.isEditing) {
            // PUT ?
        } else {
            // POST ?
        }

        emit('success')

    } catch (error) {
        console.error('Error al procesar destino:', error)
    } finally {
        isSubmitting.value = false
    }
}

watch(() => props.editingData, (newData) => {
    if (newData && props.isEditing) {
        Object.keys(formData.value).forEach(key => {
            if (newData.hasOwnProperty(key)) {
                formData.value[key] = newData[key]
            }
        })

        const destinoEncontrado = destinosData.value.find(d => d.id === newData.id)
        if (destinoEncontrado && destinoEncontrado.subgrupos) {
            formData.value.subgrupos = [...destinoEncontrado.subgrupos]
        }
    }
}, { immediate: true })

onMounted(async () => {
    await loadData()
    setupSelectOptions()

    if (!formData.value.masVendidos) formData.value.masVendidos = []
    if (!formData.value.vueloIncluido) formData.value.vueloIncluido = []
    if (!formData.value.recomendados) formData.value.recomendados = []
    if (!formData.value.subgrupos) formData.value.subgrupos = []

    if (!Array.isArray(formData.value.subgrupos)) {
        formData.value.subgrupos = []
    }

    if (formData.value.subgrupos.length > 0) {
        formData.value.subgrupos.forEach(subgrupo => {
            if (!Array.isArray(subgrupo.productos)) {
                subgrupo.productos = []
            } else {
                subgrupo.productos = subgrupo.productos.map(id => String(id))
            }
        })
    }
})
</script>