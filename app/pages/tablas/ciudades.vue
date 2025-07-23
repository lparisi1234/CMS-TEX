<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>Ciudades</HeadingH1>
        
        <ButtonPrimary @click="handleCreate" class="!px-4 sm:!px-12">Crear nueva ciudad</ButtonPrimary>
        
        <TableLayout 
            :data="displayData" 
            :columns="ciudadesColumns" 
            :related-data="relatedData"
            empty-state-text="No hay ciudades creadas"
            table-name="Ciudades"
            @edit="handleEdit"
            @delete="handleDelete" 
        />
    </DefaultSection>
</template>

<script setup>
import ciudadesData from '~/shared/ciudades/ciudades.js'
import destinosData from '~/shared/destinos/destinos.js'
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

const displayData = computed(() => ciudadesData || [])

const ciudadesColumns = [
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
        key: 'estado',
        label: 'Estado',
        type: 'badge'
    },
    {
        key: 'paises_id',
        label: 'País',
        type: 'select',
        relatedTable: 'paises'
    }
]

// Filtrar solo países (destinos con regionId) para la relación
const relatedData = ref({
    paises: destinosData.filter(destino => destino.regionId)
})

const handleCreate = () => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.CREAR}?tabla=ciudades`)
}

const handleEdit = (item) => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.EDITAR}/${item.id}?tabla=ciudades`)
}

const handleDelete = async (item) => {
    try {
        console.log(`Ciudad ${item.nombre} eliminada correctamente`)
        // Aquí harías la llamada a la API para eliminar
    } catch (error) {
        console.error('Error al eliminar:', error)
    }
}
</script>
