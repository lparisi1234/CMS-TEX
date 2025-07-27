<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>{{ tabla.name || 'Tabla no encontrada' }}</HeadingH1>
        <ButtonPrimary @click="handleCreate" class="!px-4 sm:!px-12">{{ tabla.botonTexto }}</ButtonPrimary>
        <TableLayout :data="displayData" :columns="tabla.columns" :related-data="relatedData"
            :empty-state-text="`No hay items en ${tabla.name} creados`" :table-name="tabla.name" @edit="handleEdit"
            @delete="handleDelete" />
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
// const tableData = await fetch(`/api/${tabla.endpoint}`)
//     .then(res => res.ok ? res.json() : [])
//     .catch(err => {
//         console.error('Error cargando datos:', err)
//         return []
//     })

// Data hardcodeada
const getDataForEndpoint = async (endpoint) => {
    try {
        const modules = import.meta.glob('~/shared/**/*.js', { eager: false })
        
        let foundModule = null
        for (const [path, importer] of Object.entries(modules)) {
            if (path.includes(`/${endpoint}.js`)) {
                foundModule = importer
                break
            }
        }

        if (foundModule) {
            const module = await foundModule()
            return module.default || []
        }

        console.warn(`No se encontró archivo para endpoint: ${endpoint}`)
        console.log('Módulos disponibles:', Object.keys(modules))
        return []
    } catch (error) {
        console.warn(`Error cargando datos para endpoint: ${endpoint}`)
        console.error('Error detallado:', error)
        return []
    }
}

const loadRelatedData = async () => {
    const relatedTables = {}
    
    for (const column of tabla.columns) {
        if (column.type === 'select' && column.relatedTable) {
            const relatedData = await getDataForEndpoint(column.relatedTable)
            relatedTables[column.relatedTable] = relatedData
        }
    }
    
    return relatedTables
}

const tableData = ref(await getDataForEndpoint(tabla.endpoint))
const relatedData = ref(await loadRelatedData())

const displayData = computed(() => tableData.value || [])

const handleCreate = () => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.CREAR}?tabla=${nombreSlug}`)
}

const handleEdit = (item) => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.EDITAR}/${item.id}?tabla=${nombreSlug}`)
}

const handleDelete = async (item) => {
    try {
        console.log(`Item de ${tabla.name} eliminado correctamente`)

    } catch (error) {
        console.error('Error al eliminar:', error)
    }
}
</script>