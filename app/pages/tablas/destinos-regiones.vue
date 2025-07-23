<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>Regiones</HeadingH1>
        
        <ButtonPrimary @click="handleCreate" class="!px-4 sm:!px-12">Crear nueva región</ButtonPrimary>
        
        <TableLayout 
            :data="regionesData" 
            :columns="regionesColumns" 
            :related-data="relatedData"
            empty-state-text="No hay regiones creadas"
            table-name="Regiones"
            @edit="handleEdit"
            @delete="handleDelete" 
        />
    </DefaultSection>
</template>

<script setup>
import destinosData from '~/shared/destinos/destinos.js'
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

// Filtrar solo destinos que NO tienen regionId (son regiones)
const regionesData = computed(() => {
    return destinosData.filter(destino => !destino.regionId)
})

const regionesColumns = [
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

const relatedData = ref({})

const handleCreate = () => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.CREAR}?tabla=destinos&tipo=region`)
}

const handleEdit = (item) => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.EDITAR}/${item.id}?tabla=destinos&tipo=region`)
}

const handleDelete = async (item) => {
    try {
        console.log(`Región ${item.nombre} eliminada correctamente`)
        // Aquí harías la llamada a la API para eliminar
    } catch (error) {
        console.error('Error al eliminar:', error)
    }
}
</script>
