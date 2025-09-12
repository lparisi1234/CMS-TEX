<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>{{ tabla.name || 'Opiniones' }}</HeadingH1>
        <ButtonPrimary @click="handleCreate" class="!px-4 sm:!px-12">{{ tabla.botonTexto || 'Crear nueva opinión' }}</ButtonPrimary>

        <div class="w-full max-w-md">
            <div class="flex flex-col gap-1">
                <FormLabel>Buscar una opinión</FormLabel>
                <div class="relative">
                    <FormTextField id="search" v-model="searchQuery" type="text" placeholder="Buscar opiniones de un Tour"
                        @input="handleSearch" />
                    <div class="flex items-center absolute top-1/2 right-0 transform -translate-y-1/2 pr-3">
                        <Icon name="tabler:search" class="w-5 h-5 text-gray-dark" />
                    </div>
                </div>
            </div>

            <div v-if="searchQuery && filteredOpiniones.length > 0" class="flex flex-col gap-2 mt-4">
                <div v-for="opinion in filteredOpiniones.slice(0, 10)" :key="opinion.id"
                    class="flex justify-between items-center bg-white border rounded-lg shadow-sm p-4">
                    <div>
                        <p class="font-semibold">{{ opinion.titulo || opinion.id }}</p>
                        <p class="text-sm text-gray-dark">{{ opinion.contenido || 'Sin contenido' }}</p>
                    </div>
                    <div class="flex gap-2">
                        <button @click="handleEdit(opinion)" class="bg-secondary text-light rounded text-sm px-3 py-2">
                            Editar
                        </button>
                        <button @click="openDeleteModal(opinion)"
                            class="bg-primary text-light rounded text-sm px-3 py-2">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>

            <div v-else-if="searchQuery && filteredOpiniones.length === 0"
                class="bg-gray-dark rounded-lg mt-4 p-4">
                <p class="text-dark text-center">No se encontraron opiniones con esa búsqueda</p>
            </div>
        </div>

        <TableLayout v-if="displayData.length" :data="displayData" :columns="tabla.columns" :related-data="relatedData"
            :empty-state-text="`No hay items en ${tabla.name} creados`" :table-name="tabla.name" @edit="handleEdit"
            @delete="handleDelete" />
    </DefaultSection>

    <ModalDelete v-if="showDeleteModal" :isOpen="showDeleteModal" :itemName="opinionAEliminar?.titulo || `Opinión ${opinionAEliminar?.id}`"
        tableName="opinión" @cancel="closeDeleteModal" @confirm="confirmDelete" />
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

const { success, error } = useNotification()
const nombreSlug = 'opiniones'

const { findTableBySlug } = useDynamicForm(nombreSlug)
const tabla = findTableBySlug(nombreSlug)

if (!tabla) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Tabla no encontrada'
    })
}

const searchQuery = ref('')
const opiniones = ref([])
const showDeleteModal = ref(false)
const opinionAEliminar = ref(null)

const tableData = await $fetch(`/api/opiniones/opiniones`).catch(err => {
    console.error('Error cargando datos:', err)
    return []
})

const loadOpiniones = async () => {
    try {
        const data = await $fetch('/api/opiniones/opiniones')
        opiniones.value = data || []
    } catch (err) {
        console.error('Error cargando opiniones:', err)
        error('Error al cargar las opiniones')
    }
}

onMounted(() => {
    loadOpiniones()
})

const filteredOpiniones = computed(() => {
    if (!searchQuery.value) return []

    const searchValue = searchQuery.value.toLowerCase()

    return opiniones.value.filter(opinion => {
        const titulo = opinion.titulo?.toLowerCase() || ''
        const contenido = opinion.contenido?.toLowerCase() || ''
        const id = opinion.id?.toString() || ''

        return titulo.includes(searchValue) || contenido.includes(searchValue) || id.includes(searchValue)
    })
})

const handleSearch = () => {
}

const loadRelatedData = async () => {
    const relatedTables = {}

    for (const column of tabla.columns) {
        if ((column.type === 'select' || column.type === 'checkbox-multiple') && column.relatedTable) {
            try {
                const relatedTabla = findTableBySlug(column.relatedTable)
                if (relatedTabla) {
                    const relatedData = await $fetch(`/api/${relatedTabla.endpoint}`)
                    relatedTables[column.relatedTable] = relatedData || []
                } else {
                    relatedTables[column.relatedTable] = []
                }
            } catch (error) {
                console.error(`Error cargando datos relacionados para ${column.relatedTable}:`, error)
                relatedTables[column.relatedTable] = []
            }
        }
    }

    return relatedTables
}

const relatedData = ref(await loadRelatedData())

const displayData = computed(() => tableData || [])

const handleCreate = () => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.CREAR}?tabla=${nombreSlug}`)
}

const handleEdit = (item) => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.EDITAR}/${item.id}?tabla=${nombreSlug}`)
}

const openDeleteModal = (opinion) => {
    opinionAEliminar.value = opinion
    showDeleteModal.value = true
}

const closeDeleteModal = () => {
    showDeleteModal.value = false
    opinionAEliminar.value = null
}

const confirmDelete = async () => {
    try {
        await $fetch('/api/opiniones/delete', {
            method: 'POST',
            body: { id: opinionAEliminar.value.id }
        })

        const index = opiniones.value.findIndex(o =>
            o.id === opinionAEliminar.value.id
        )

        if (index > -1) {
            opiniones.value.splice(index, 1)
        }

        success('Opinión eliminada exitosamente')
        closeDeleteModal()
        location.reload()
    } catch (err) {
        console.error('Error al eliminar opinión:', err)
        error('Error al eliminar la opinión')
    }
}

const handleDelete = async (item) => {
    try {
        await $fetch(`/api/opiniones/delete`, {
            method: 'POST',
            body: { id: item.id }
        })
        
        success(`Opinión eliminada exitosamente`)
        location.reload()
    } catch (err) {
        console.error('Error al eliminar:', err)
        error(`Error al eliminar opinión`)
    }
}
</script>