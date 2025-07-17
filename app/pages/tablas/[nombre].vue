<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>{{ tabla.name || 'Tabla no encontrada' }}</HeadingH1>
        <ButtonPrimary @click="handleCreate" class="!px-4 sm:!px-12">{{ tabla.botonTexto }}</ButtonPrimary>
        <TableLayout :data="displayData" :columns="tabla.columns"
            :empty-state-text="`No hay items en ${tabla.name} creados`" @edit="handleEdit" @delete="handleDelete" />
    </DefaultSection>
</template>

<script setup>
import tablas from '~/shared/tablas.js'
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

const route = useRoute()
const nombreSlug = route.params.nombre

const getTabla = () => {
    const configTabla = tablas.configuracion.find(item => item.slug === nombreSlug)
    if (configTabla) return configTabla

    const adminTabla = tablas.administracion.find(item => item.slug === nombreSlug)
    if (adminTabla) return adminTabla

    return null
}

const tabla = getTabla()

if (!tabla) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Tabla no encontrada'
    })
}

// Endpoint
// const tableData = await fetch(`/api/${tabla.endpoint}`)
//     .then(res => res.ok ? res.json() : [])
//     .catch(err => {
//         console.error('Error cargando datos:', err)
//         return []
//     })

// Data hardcodeada
const getDataForEndpoint = async () => {
    try {
        const modules = import.meta.glob('~/shared/**/*.js', { eager: false })
        const modulePath = `/shared/${tabla.endpoint}.js`

        const moduleImporter = modules[modulePath]
        if (moduleImporter) {
            const module = await moduleImporter()
            return module.default || []
        }

        console.warn(`No se encontró archivo para endpoint: ${tabla.endpoint}`)
        return []
    } catch (error) {
        console.warn(`Error cargando datos para endpoint: ${tabla.endpoint}`)
        console.error('Error detallado:', error)
        return []
    }
}

const tableData = ref(await getDataForEndpoint())

const displayData = computed(() => tableData.value || [])

const handleCreate = () => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.CREAR}`)
}

const handleEdit = (item) => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.EDITAR}/${item.id}`)
}

const handleDelete = async (item) => {
    if (confirm(`¿Estás seguro de que deseas eliminar este item de ${tabla.name}?`)) {
        try {
            // Delete item

            console.log(`Item de ${tabla.name} eliminado correctamente`)
        } catch (error) {
            console.error('Error al eliminar:', error)
        }
    }
}
</script>