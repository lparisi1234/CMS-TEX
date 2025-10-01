<template>
    <FormLayout @submit="handleSubmit" class="flex flex-col gap-5">
        <TabsLayout :tabs="tabs" style="-webkit-overflow-scrolling: touch;">
            <template #detalle>
                <div class="flex flex-col gap-5">
                    <FormFieldsContainer>
                        <FormTextField v-model="formData.nombreprod" id="nombreprod" label="Nombre del Producto"
                            required placeholder="Ingresa el nombre del producto" :error="errors.nombreprod" />
<FormTextField v-model="formData.cod_newton" id="cod_newton" label="Código" type="text" required
    placeholder="Código del producto" :error="errors.cod_newton" />
                    </FormFieldsContainer>

                    <FormFieldsContainer>
                        <FormTextField v-model="formData.url" id="url" label="URL" required
                            placeholder="/productos/nombre-producto" :error="errors.url" />
                        <FormTextField v-model="formData.h1" id="h1" label="H1" required
                            placeholder="Título principal del producto" :error="errors.h1" />
                    </FormFieldsContainer>

                    <FormFieldsContainer>
                        <FormTextField v-model="formData.meta_titulo" id="meta_titulo" label="Meta Título"
                            placeholder="Título para SEO" :error="errors.meta_titulo" />
                        <FormTextField v-model="formData.meta_descripcion" id="meta_descripcion"
                            label="Meta Descripción" placeholder="Descripción para SEO"
                            :error="errors.meta_descripcion" />
                    </FormFieldsContainer>

                    <FormFieldsContainer>
                        <FormImageField v-model="formData.img" id="img" label="Imagen Principal" :error="errors.img"
                            targetFolder="productos" size="30px x 30px" />
                        <FormImageField v-model="formData.img_mobile" id="img_mobile" label="Imagen Mobile"
                            :error="errors.img_mobile" targetFolder="productos" size="30px x 30px" />
                    </FormFieldsContainer>

                    <FormFieldsContainer>
                        <FormImageField v-model="formData.video_mapa_mobile" id="video_mapa_mobile"
                            label="Video Mapa Mobile" :error="errors.video_mapa_mobile" targetFolder="productos"
                            size="30px x 30px" />
                        <FormImageField v-model="formData.video_mapa_desktop" id="video_mapa_desktop"
                            label="Video Mapa Desktop" :error="errors.video_mapa_desktop" targetFolder="productos"
                            size="30px x 30px" />
                    </FormFieldsContainer>

                    <FormFieldsContainer>
                        <FormTextField v-model="formData.cantidad_estrellas" id="cantidad_estrellas"
                            label="Cantidad de Estrellas" type="number" min="1" max="5" placeholder="Calificación (1-5)"
                            :error="errors.cantidad_estrellas" />
                        <FormTextField v-model="formData.cantidadAport" id="cantidadAport" label="Cantidad de Aportes"
                            type="number" placeholder="Número de reviews o comentarios" :error="errors.cantidadAport" />
                    </FormFieldsContainer>

                    <FormFieldsContainer>
                        <FormSwitchField v-model="formData.estado" id="estado" label="Estado" required
                            :error="errors.estado" />
                        <FormSelectField v-model="formData.experto_id" id="experto_id" label="Experto"
                            :options="expertosOptions" placeholder="Seleccionar experto" :error="errors.experto_id" />
                    </FormFieldsContainer>

                    <FormFieldsContainer>
                        <FormTextareaField v-model="formData.consejo_experto" id="consejo_experto"
                            label="Consejo del Experto" placeholder="Escribe un Consejo de Experto" :rows="3"
                            :error="errors.consejo_experto" />
                    </FormFieldsContainer>

                    <FormFieldsContainer>
                        <FormTextareaField v-model="formData.podcast" id="podcast" label="Podcast"
                            placeholder="Escribe el iframe del podcast del tour" :error="errors.podcast" />
                    </FormFieldsContainer>
                </div>
            </template>

            <template #segmentos>
                <div class="flex flex-col gap-5">
                    <FormFieldsContainer>
                        <FormCheckboxGroupField id="segmentos-excluidos" v-model="formData.segmentos_excluidos"
                            :options="segmentosOptions" label="Segmentos Excluidos" />
                    </FormFieldsContainer>
                </div>
            </template>

            <template #secciones>
                <div class="flex flex-col gap-5">
                    <TableLayout :data="displaySecciones" :columns="seccionesColumns" :table-name="'Secciones'"
                        :show-actions="true" :empty-state-text="'No hay secciones creadas'" @edit="handleEditSeccion"
                        @delete="handleDeleteSeccion" />
                    <div class="flex justify-start pb-4">
                        <ButtonPrimary @click.prevent.stop="openCreateSeccionModal" type="button">
                            + Agregar Sección
                        </ButtonPrimary>
                    </div>
                </div>

                <div v-if="showSeccionModal"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    @click="handleSeccionModalBackgroundClick">
                    <div class="w-full max-w-[60rem] flex flex-col gap-6 bg-light rounded-[20px] p-8" @click.stop>
                        <HeadingH2 class="text-center">
                            {{ isEditingSeccion ? 'Editar Sección' : 'Crear Sección' }}
                        </HeadingH2>
                        <form @submit.prevent="saveSeccion" class="flex flex-col gap-4">
                            <FormFieldsContainer>
                                <FormSelectField id="modal-pagina" v-model="modalSeccion.pagina" label="Página"
                                    :options="paginaOptions" required />
                                <FormSelectField id="modal-seccion" v-model="modalSeccion.seccion" label="Sección"
                                    :options="seccionOptions" required :disabled="!modalSeccion.pagina" />
                            </FormFieldsContainer>
                            <FormFieldsContainer>
                                <FormCheckboxGroupField id="modal-segmentos" v-model="modalSeccion.segmentos_excluidos"
                                    :options="segmentosOptions" label="Segmentos excluidos" />
                            </FormFieldsContainer>
                            <div class="flex justify-center gap-5 mt-2">
                                <ButtonPrimary @click.prevent="closeSeccionModal('cancel-button')" type="button"
                                    class="!bg-gray-mid !text-dark">
                                    Cancelar
                                </ButtonPrimary>
                                <ButtonPrimary type="submit">
                                    {{ isEditingSeccion ? 'Actualizar' : 'Crear' }}
                                </ButtonPrimary>
                            </div>
                        </form>
                    </div>
                </div>
            </template>
            <template #itinerario>
                <div class="flex flex-col gap-5">
                    <div v-if="formData.itinerario.length === 0" class="text-center py-8">
                        <p class="text-gray-600 mb-4">No hay días agregados al itinerario</p>
                    </div>

                    <div v-for="(dia, index) in formData.itinerario" :key="dia.id">
                        <div class="flex items-center justify-between">
                            <div @click="toggleDiaAccordion(index)"
                                class="w-full flex items-center gap-3 cursor-pointer">
                                <div class="w-full flex items-center">
                                    <button @click.stop="eliminarDia(index)" aria-label="Eliminar día" type="button"
                                        class="w-8 h-8 flex justify-center items-center text-primary">
                                        <Icon name="tabler:x" class="w-5 h-5" />
                                    </button>
                                    <div class="bg-gray-mid rounded-md p-1.5">
                                        <p class="text-xl text-dark">Día: <span class="font-bold">{{ dia.dia }}</span>
                                        </p>
                                    </div>
                                </div>
                                <Icon :name="dia.isOpen ? 'tabler:chevron-up' : 'tabler:chevron-down'"
                                    class="w-8 h-8 text-primary transition-transform duration-300 ease-in-out" />
                            </div>
                        </div>

                        <Transition enter-active-class="transition-all duration-300 ease-out"
                            leave-active-class="transition-all duration-300 ease-in"
                            enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-screen"
                            leave-from-class="opacity-100 max-h-screen" leave-to-class="opacity-0 max-h-0">
                            <div v-if="dia.isOpen" class="border-b border-terciary pt-3 pb-6 overflow-hidden">
                                <div class="flex flex-col gap-4">
                                    <FormFieldsContainer>
                                        <FormTextField v-model="dia.titulo" :id="`titulo-dia-${index}`" label="Título"
                                            required placeholder="Escribe el nombre del tour" />
                                        <div class="flex flex-col gap-2">
                                            <FormLabel :id="`destacados-dia-${index}`">Destacados</FormLabel>
                                            <div class="flex items-center gap-6">
                                                <button @click="agregarDestacado(index)" aria-label="Agregar destacado"
                                                    type="button"
                                                    class="w-7 h-7 flex justify-center items-center bg-primary text-white rounded-lg">
                                                    <Icon name="tabler:plus" class="w-4 h-4" />
                                                </button>
                                                <span class="text-xl text-dark font-light">{{ dia.destacados.length
                                                    }}</span>
                                            </div>
                                        </div>
                                    </FormFieldsContainer>

                                    <FormTextareaField v-model="dia.texto" :id="`texto-dia-${index}`" label="Texto"
                                        required placeholder="Escribe el ID del tour" :rows="3" />
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <div class="flex justify-start pb-4">
                        <ButtonPrimary @click.prevent.stop="agregarDia" type="button">
                            + Agregar Día
                        </ButtonPrimary>
                    </div>
                </div>

                <div v-if="showDestacadosModal"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    @click="handleDestacadosModalBackgroundClick">
                    <div class="w-full max-w-[60rem] flex flex-col gap-6 bg-light rounded-[20px] p-8" @click.stop>
                        <HeadingH2 class="text-center">
                            Destacados - Día del itinerario: {{ formData.itinerario[currentDiaIndex]?.dia || currentDiaIndex + 1 }}
                        </HeadingH2>

                        <div class="flex flex-col gap-5">
                            <div v-if="currentDestacados.length === 0" class="text-center py-8">
                                <p class="text-gray-600 mb-4">No hay destacados agregados</p>
                            </div>

                            <div v-for="(destacado, index) in currentDestacados" :key="destacado.id">
                                <div class="flex items-center justify-between">
                                    <div @click="toggleDestacadoAccordion(index)"
                                        class="w-full flex items-center gap-3 cursor-pointer flex-1">
                                        <div class="w-full flex items-center">
                                            <button @click.stop="eliminarDestacado(index)"
                                                aria-label="Eliminar destacado" type="button"
                                                class="w-8 h-8 flex justify-center items-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200">
                                                <Icon name="tabler:x" class="w-5 h-5" />
                                            </button>
                                            <div class="bg-gray-mid rounded-md p-1.5">
                                                <p class="text-lg text-dark">Destacado: <span class="font-bold">{{ index
                                                    + 1
                                                        }}</span></p>
                                            </div>
                                        </div>
                                        <Icon :name="destacado.isOpen ? 'tabler:chevron-up' : 'tabler:chevron-down'"
                                            class="w-6 h-6 text-primary transition-transform duration-300 ease-in-out" />
                                    </div>

                                </div>

                                <Transition enter-active-class="transition-all duration-300 ease-out"
                                    leave-active-class="transition-all duration-300 ease-in"
                                    enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-screen"
                                    leave-from-class="opacity-100 max-h-screen" leave-to-class="opacity-0 max-h-0">
                                    <div v-if="destacado.isOpen"
                                        class="border-b border-terciary pt-3 pb-6 overflow-hidden">
                                        <div class="flex flex-col gap-4">
                                            <FormFieldsContainer>
                                                <FormTextField v-model="destacado.titulo"
                                                    :id="`titulo-destacado-${index}`" label="Título"
                                                    placeholder="Título del destacado" />
                                                <FormImageField v-model="destacado.imagen"
                                                    :id="`imagen-destacado-${index}`" label="Imagen"
                                                    targetFolder="productos" size="290px x 180px" />
                                            </FormFieldsContainer>
                                        </div>
                                    </div>
                                </Transition>
                            </div>

                            <div class="flex justify-start pb-4">
                                <ButtonPrimary @click.prevent.stop="agregarDestacadoModal" type="button">
                                    + Agregar Destacado
                                </ButtonPrimary>
                            </div>
                        </div>

                        <div class="flex justify-center gap-5 mt-2">
                            <ButtonPrimary @click.prevent="cancelDestacadosModal" type="button"
                                class="!bg-gray-mid !text-dark">
                                Cancelar
                            </ButtonPrimary>
                            <ButtonPrimary @click.prevent="saveDestacadosModal" type="button">
                                Guardar
                            </ButtonPrimary>
                        </div>
                    </div>
                </div>
            </template>
        </TabsLayout>

        <div class="flex justify-center items-center flex-wrap gap-8 mt-3">
            <ButtonPrimary @click="$emit('cancel')" class="!bg-gray-mid !text-dark">
                Cancelar
            </ButtonPrimary>
            <ButtonPrimary type="submit" :disabled="isSubmitting">
                <span v-if="!isSubmitting">{{ isEditing ? 'Actualizar' : 'Crear' }} Producto</span>
                <span v-else class="flex items-center gap-2">
                    <Icon name="tabler:loader-2" class="animate-spin" />
                    {{ isEditing ? 'Actualizando...' : 'Creando...' }}
                </span>
            </ButtonPrimary>
        </div>
    </FormLayout>
</template>

<script setup>
const { success, error } = useNotification()

const segmentosData = ref([])
const expertosData = ref([])
const productosData = ref([])
const itinerarioData = ref([])

const loadData = async () => {
    try {
        const [segmentos, expertos, productos, itinerario] = await Promise.all([
            $fetch('/api/segmentos/segmentos'),
            $fetch('/api/expertos/expertos'),
            $fetch('/api/productos/productos'),
            $fetch('/api/itinerarios/itinerarios')
        ])

        segmentosData.value = segmentos || []
        expertosData.value = expertos || []
        productosData.value = productos || []
        itinerarioData.value = itinerario || []
    } catch (err) {
        console.error('Error cargando datos:', err)
        error('Error al cargar los datos')
    }
}

const props = defineProps({
    isEditing: {
        type: Boolean,
        default: false
    },
    editingData: {
        type: Object,
        default: null
    },
    productId: {
        type: [String, Number],
        default: null
    }
})

const emit = defineEmits(['success', 'cancel'])

const formData = ref({
    nombreprod: '',
    h1: '',
    img: '',
    img_mobile: '',
    video_mapa_mobile: '',
    video_mapa_desktop: '',
    podcast: '',
    cod_newton: '',
    url: '',
    cantidad_estrellas: 5,
    cantidadAport: 0,
    consejo_experto: '',
    experto_id: '',
    meta_titulo: '',
    meta_descripcion: '',
    precio_total: 0,
    estado: true,
    segmentos_excluidos: [],
    secciones: [],
    itinerario: []
})

watchEffect(() => {
    if (Array.isArray(formData.value.segmentos_excluidos)) {
        formData.value.segmentos_excluidos = formData.value.segmentos_excluidos.map(v => v.toString())
    }
    if (Array.isArray(formData.value.secciones)) {
        formData.value.secciones = formData.value.secciones.map(seccion => ({
            ...seccion,
            segmentos_excluidos: Array.isArray(seccion.segmentos_excluidos)
                ? seccion.segmentos_excluidos.map(v => v.toString())
                : []
        }))
    }
})

const tabs = [
    { id: 'detalle', label: 'Detalle' },
    { id: 'segmentos', label: 'Segmentos excluidos' },
    { id: 'secciones', label: 'Secciones' },
    { id: 'itinerario', label: 'Itinerario' }
]

const errors = ref({})
const isSubmitting = ref(false)

const segmentosOptions = computed(() =>
    segmentosData.value.map(s => ({
        value: s.id,
        label: s.descripcion
    }))
)

const expertosOptions = computed(() =>
    expertosData.value.map(e => ({
        value: e.id,
        label: e.nombre
    }))
)

const seccionesColumns = [
    { key: 'seccion', label: 'Sección', type: 'text', required: true },
    { key: 'segmentos_excluidos', label: 'Segmentos excluidos', type: 'array-ids', required: false }
]

const paginaOptions = [
    { value: 'home', label: 'Home' },
    { value: 'grupos', label: 'Grupos de Ofertas' }
]

const seccionOptions = computed(() => {
    if (modalSeccion.value.pagina === 'home') {
        return [
            { value: 'mas_vendidos', label: 'Mas vendidos' },
            { value: 'vuelo_incluido', label: 'Vuelo incluido' }
        ]
    } else if (modalSeccion.value.pagina === 'grupos') {
        return [
            { value: 'tours_europa', label: 'Tours por Europa, Escandinavia y Balticos' },
            { value: 'amigos_europa', label: 'Viaja con amigos por Europa' }
        ]
    }
    return []
})

const displaySecciones = computed(() => {
    const secciones = formData.value.secciones || []
    if (!Array.isArray(secciones)) return []

    return secciones.map(seccion => ({
        ...seccion,
        segmentos_excluidos: Array.isArray(seccion.segmentos_excluidos)
            ? (seccion.segmentos_excluidos.length > 0
                ? seccion.segmentos_excluidos
                    .map(id => {
                        const found = segmentosOptions.value.find(s => String(s.value) === String(id))
                        return found ? found.label : `ID: ${id}`
                    })
                    .join(', ')
                : 'Sin segmentos')
            : String(seccion.segmentos_excluidos || 'Sin segmentos')
    }))
})

const seccionModalDefault = {
    pagina: '',
    seccion: '',
    segmentos_excluidos: []
}
const modalSeccion = ref({ ...seccionModalDefault })
const showSeccionModal = ref(false)
const isEditingSeccion = ref(false)
const editingSeccionIndex = ref(-1)

const showDestacadosModal = ref(false)
const currentDiaIndex = ref(-1)
const currentDestacados = ref([])

const openCreateSeccionModal = (event) => {
    if (event) {
        event.preventDefault()
        event.stopPropagation()
    }
    isEditingSeccion.value = false
    editingSeccionIndex.value = -1
    modalSeccion.value = { ...seccionModalDefault }
    showSeccionModal.value = true
}

const handleEditSeccion = (seccion) => {
    nextTick(() => editSeccion(seccion))
}

const handleDeleteSeccion = (seccion) => {
    deleteSeccion(seccion)
}

const editSeccion = (seccion) => {
    const idx = formData.value.secciones.findIndex(s => s.id === seccion.id)
    if (idx !== -1) {
        isEditingSeccion.value = true
        editingSeccionIndex.value = idx
        const original = formData.value.secciones[idx]
        modalSeccion.value = {
            pagina: original.pagina || '',
            seccion: original.seccion || '',
            segmentos_excluidos: Array.isArray(original.segmentos_excluidos)
                ? original.segmentos_excluidos.map(v => v.toString())
                : []
        }
        showSeccionModal.value = true
    }
}

const closeSeccionModal = () => {
    showSeccionModal.value = false
    isEditingSeccion.value = false
    editingSeccionIndex.value = -1
    modalSeccion.value = { ...seccionModalDefault }
}

const handleSeccionModalBackgroundClick = (event) => {
    if (event.target === event.currentTarget) {
        closeSeccionModal('background-click')
    }
}

const saveSeccion = () => {
    if (!modalSeccion.value.pagina || !modalSeccion.value.seccion) return

    const seccionData = {
        id: isEditingSeccion.value
            ? formData.value.secciones[editingSeccionIndex.value].id
            : Date.now(),
        pagina: modalSeccion.value.pagina,
        seccion: modalSeccion.value.seccion,
        segmentos_excluidos: Array.isArray(modalSeccion.value.segmentos_excluidos)
            ? modalSeccion.value.segmentos_excluidos.map(v => v.toString())
            : []
    }

    if (!formData.value.secciones) {
        formData.value.secciones = []
    }

    if (isEditingSeccion.value) {
        formData.value.secciones[editingSeccionIndex.value] = seccionData
    } else {
        formData.value.secciones.push(seccionData)
    }

    closeSeccionModal('form-submitted')
}

const deleteSeccion = (seccion) => {
    const idx = formData.value.secciones.findIndex(s => s.id === seccion.id)
    if (idx !== -1) {
        formData.value.secciones.splice(idx, 1)
    }
}

const agregarDia = () => {
    const nuevoDia = {
        dia: formData.value.itinerario.length + 1,
        titulo: '',
        destacados: [],
        texto: '',
        isOpen: true
    }
    formData.value.itinerario.push(nuevoDia)
}

const toggleDiaAccordion = (index) => {
    formData.value.itinerario[index].isOpen = !formData.value.itinerario[index].isOpen
}

const agregarDestacado = (index) => {
    currentDiaIndex.value = index
    currentDestacados.value = [...formData.value.itinerario[index].destacados]
    showDestacadosModal.value = true
}

const recalcularNumerosDias = () => {
    formData.value.itinerario.forEach((dia, index) => {
        dia.dia = index + 1
    })
}

const eliminarDia = (index) => {
    formData.value.itinerario.splice(index, 1)
    recalcularNumerosDias()
}

const agregarDestacadoModal = () => {
    const nuevoDestacado = {
        id: Date.now(),
        titulo: '',
        imagen: '',
        isOpen: true
    }
    currentDestacados.value.push(nuevoDestacado)
}

const toggleDestacadoAccordion = (index) => {
    currentDestacados.value[index].isOpen = !currentDestacados.value[index].isOpen
}

const eliminarDestacado = (index) => {
    currentDestacados.value.splice(index, 1)
}

const saveDestacadosModal = () => {
    const destacadosConInfo = currentDestacados.value.filter(destacado =>
        destacado.titulo && destacado.titulo.trim() !== '' &&
        destacado.imagen && destacado.imagen.trim() !== ''
    )

    formData.value.itinerario[currentDiaIndex.value].destacados = destacadosConInfo
    closeDestacadosModal()
}

const cancelDestacadosModal = () => {
    closeDestacadosModal()
}

const closeDestacadosModal = () => {
    showDestacadosModal.value = false
    currentDiaIndex.value = -1
    currentDestacados.value = []
}

const handleDestacadosModalBackgroundClick = (event) => {
    if (event.target === event.currentTarget) {
        cancelDestacadosModal()
    }
}

const handleSubmit = async () => {
    if (!formData.value.nombreprod || !formData.value.cod_newton) {
        error('Por favor completa todos los campos requeridos')
        return
    }

    isSubmitting.value = true

    try {
        // Preparar datos del producto
        const dataToSubmit = { ...formData.value }
        delete dataToSubmit.itinerario // Remove itinerario from main product data

        if (!props.isEditing) {
            const timestamp = Date.now()
            const lastDigits = timestamp.toString().slice(-6)
            dataToSubmit.id = `3/${lastDigits}`
        }

        dataToSubmit.cantidad_estrellas = parseInt(dataToSubmit.cantidad_estrellas) || 5
        dataToSubmit.cantidadAport = parseInt(dataToSubmit.cantidadAport) || 0
        dataToSubmit.experto_id = dataToSubmit.experto_id ? parseInt(dataToSubmit.experto_id) : null
        dataToSubmit.estado = dataToSubmit.estado ? 1 : 0

        let productId

        // Guardar el producto primero
        if (props.isEditing && props.editingData?.id) {
            // Actualizar producto existente
            dataToSubmit.id = props.editingData.id
            productId = props.editingData.id
            const result = await $fetch('/api/productos/update', {
                method: 'PUT',
                body: dataToSubmit
            })

            if (!result.success) {
                throw new Error(result.message || 'Error al actualizar el producto')
            }
        } else {
            // Crear nuevo producto
            const result = await $fetch('/api/productos/create', {
                method: 'PUT',
                body: dataToSubmit
            })

            if (!result.success) {
                throw new Error(result.message || 'Error al crear el producto')
            }
            
            productId = result.id
            if (!productId) {
                console.error('Respuesta del servidor:', result)
                throw new Error('No se recibió el ID del producto creado')
            }
            
            console.log('Producto creado con ID:', productId)
        }

        // Si hay itinerarios, guardarlos
        if (formData.value.itinerario && formData.value.itinerario.length > 0) {
            const itinerariosToSubmit = formData.value.itinerario.map(dia => ({
                nro_dia: dia.dia,
                titulo: dia.titulo || '',
                texto: dia.texto || ''
            }))

            // Enviar los itinerarios al backend
            const itinerariosResult = await $fetch(`/api/itinerarios/${productId}`, {
                method: 'PUT',
                body: {
                    itinerarios: itinerariosToSubmit,
                    productId: productId
                }
            })

            if (!itinerariosResult.success) {
                throw new Error(itinerariosResult.message || 'Error al guardar los itinerarios')
            }
        }

        success(props.isEditing ? 'Producto actualizado correctamente' : 'Producto creado correctamente')
        emit('success')

    } catch (error) {
        console.error('Error al procesar producto:', error)
        error('Error al procesar el producto')
    } finally {
        isSubmitting.value = false
    }
}

const loadItinerarios = async (productoId) => {
   
    try {
        
        const response = await $fetch(`/api/itinerarios/${productoId}`, {
            method: 'GET'
        })
        if (response && Array.isArray(response)) {
            // Sort by nro_dia and transform to expected format
            const itinerariosOrdenados = response
                .sort((a, b) => a.nro_dia - b.nro_dia)
                .map(item => ({
                    id: item.id,
                    dia: item.nro_dia,
                    titulo: item.titulo,
                    texto: item.texto,
                    destacados: [], 
                    isOpen: true
                }))
            
            formData.value.itinerario = itinerariosOrdenados
        }
    } catch (error) {
        console.error('Error loading itinerarios:', error)
        error('Error al cargar los itinerarios')
    }
}

const loadProductData = async () => {
    if (props.isEditing && props.productId) {
        
        const producto = productosData.value.find(p =>
            String(p.id) === String(props.productId)
        )

       

        if (producto) {
            // Load basic product data
            Object.keys(formData.value).forEach(key => {
                if (producto.hasOwnProperty(key)) {
                    if (key === 'segmentos_excluidos' || key === 'secciones') {
                        formData.value[key] = Array.isArray(producto[key])
                            ? [...producto[key]]
                            : []
                       
                    } else if (key !== 'itinerario') { // Skip itinerario as it's loaded separately
                        if (key === 'estado') {
                            formData.value[key] = producto[key] == 1 || producto[key] === true
                        } else {
                            formData.value[key] = producto[key]
                        }
                    }
                }
            })

            // Load itinerarios separately
            await loadItinerarios(props.productId)

        } else {
            console.warn('Product not found in productosData')
        }
    } else if (props.editingData) {
        console.log('Loading from editingData:', props.editingData)
        Object.keys(formData.value).forEach(key => {
            if (props.editingData.hasOwnProperty(key)) {
                if (key === 'segmentos_excluidos' || key === 'secciones') {
                    formData.value[key] = Array.isArray(props.editingData[key])
                        ? [...props.editingData[key]]
                        : []
                    console.log(`Loaded ${key}:`, formData.value[key])
                } else if (key !== 'itinerario') { // Skip itinerario as it's loaded separately
                    if (key === 'estado') {
                        formData.value[key] = props.editingData[key] == 1 || props.editingData[key] === true
                    } else {
                        formData.value[key] = props.editingData[key]
                    }
                }
            }
        })

        // Load itinerarios if we have a product ID
        if (props.editingData.id) {
            await loadItinerarios(props.editingData.id)
        }
    }
}

watch(() => props.editingData, (newData) => {
    if (newData && props.isEditing) {
        loadProductData()
    }
}, { immediate: true })

onMounted(async () => {
    await loadData()
    if (props.isEditing) {
        loadProductData()
    }
})
</script>