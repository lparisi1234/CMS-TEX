<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>Países</HeadingH1>
        
        <ButtonPrimary @click="handleCreate" class="!px-4 sm:!px-12">Crear nuevo país</ButtonPrimary>
        
        <TableLayout 
            :data="paisesData" 
            :columns="paisesColumns" 
            :related-data="relatedData"
            empty-state-text="No hay países creados"
            table-name="Países"
            @edit="handleEdit"
            @delete="handleDelete" 
        />
    </DefaultSection>
</template>

<script setup>
import destinosData from '~/shared/destinos/destinos.js'
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

// Filtrar solo destinos que SÍ tienen regionId (son países)
const paisesData = computed(() => {
    return destinosData.filter(destino => destino.regionId)
})

// Obtener regiones para mostrar en la tabla
const regionesMap = computed(() => {
    const regiones = destinosData.filter(destino => !destino.regionId)
    const map = {}
    regiones.forEach(region => {
        map[region.id] = region.nombre
    })
    return map
})

const paisesColumns = [
    {
        key: 'id',
        label: 'ID',
        type: 'number'
    },
    {
        key: 'nombre',
        label: 'Nombre',
        type: 'text'
    },
    {
        key: 'regionId',
        label: 'Región',
        type: 'select',
        relatedTable: 'regiones'
    },
    {
        key: 'url',
        label: 'URL',
        type: 'text'
    },
    {
        key: 'h1',
        label: 'H1',
        type: 'text'
    },
    {
        key: 'h2',
        label: 'H2',
        type: 'text'
    },
    {
        key: 'estado',
        label: 'Estado',
        type: 'badge'
    },
    {
        key: 'desde_precio',
        label: 'Precio Desde',
        type: 'currency'
    }
]

const relatedData = ref({
    regiones: destinosData.filter(destino => !destino.regionId)
})

const handleCreate = () => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.CREAR}?tabla=destinos&tipo=pais`)
}

const handleEdit = (item) => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.EDITAR}/${item.id}?tabla=destinos&tipo=pais`)
}

const handleDelete = async (item) => {
    try {
        console.log(`País ${item.nombre} eliminado correctamente`)
        // Aquí harías la llamada a la API para eliminar
    } catch (error) {
        console.error('Error al eliminar:', error)
    }
}
</script>
