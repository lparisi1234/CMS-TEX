<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>{{ tabla.name || 'Tabla no encontrada' }}</HeadingH1>
        <ButtonPrimary @click="handleCreate" class="!px-4 sm:!px-12">{{ tabla.botonTexto }}</ButtonPrimary>
        <TableLayout v-if="displayData.length" :data="displayData" :columns="tabla.columns" :related-data="relatedData"
            :empty-state-text="`No hay items en ${tabla.name} creados`" :table-name="tabla.name" @edit="handleEdit"
            @delete="handleDelete" />
    </DefaultSection>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

const route = useRoute()
const { success, error } = useNotification()
const nombreSlug = route.params.nombre

const { findTableBySlug } = useDynamicForm(nombreSlug)
const tabla = findTableBySlug(nombreSlug)

if (!tabla) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Tabla no encontrada'
    })
}

if (nombreSlug === 'whatsapp') {
    await navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.WHATSAPP}`)
}

if (nombreSlug === 'destinos') {
    await navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.DESTINOS}`)
}

if (nombreSlug === 'productos') {
    await navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.PRODUCTOS}`)
}

if (nombreSlug === 'que-esperar-categorias') {
    await navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.QUE_ESPERAR}`)
}

// Endpoint
const tableData = await $fetch(`/api/${tabla.endpoint}`).catch(err => {
    console.error('Error cargando datos:', err)
    return []
})


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

const handleDelete = async (item) => {
    try {
        const endpointBase = tabla.endpoint.split('/')[0] // Obtener 'segmentos' de 'segmentos/segmentos'
        await $fetch(`/api/${endpointBase}/delete`, {
            method: 'POST',
            body: { id: item.id }
        })
        
        success(`${tabla.name} eliminado exitosamente`)
        // Recargar datos después de eliminar
        location.reload()
    } catch (err) {
        console.error('Error al eliminar:', err)
        error(`Error al eliminar ${tabla.name}`)
    }
}
</script>