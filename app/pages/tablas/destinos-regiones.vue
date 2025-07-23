<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>Regiones</HeadingH1>

        <ButtonPrimary @click="handleCreate" class="!px-4 sm:!px-12">Crear nueva región</ButtonPrimary>

        <TableLayout :data="regionesData" :columns="regionesColumns" :related-data="relatedData"
            empty-state-text="No hay regiones creadas" table-name="Regiones" @edit="handleEdit"
            @delete="handleDelete" />
    </DefaultSection>
</template>

<script setup>
import destinosData from '~/shared/destinos/destinos.js'
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

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
        key: 'url',
        label: 'URL',
        type: 'text'
    },
    {
        key: 'nombre',
        label: 'Nombre',
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
        key: 'video_mobile',
        label: 'Video Mobile',
        type: 'image'
    },
    {
        key: 'video_desktop',
        label: 'Video Desktop',
        type: 'image'
    },
    {
        key: 'experto_id',
        label: 'Experto',
        type: 'select',
        relatedTable: 'expertos'
    },
    {
        key: 'consejo_experto',
        label: 'Consejo Experto',
        type: 'text'
    },
    {
        key: 'img',
        label: 'Imagen',
        type: 'image'
    },
    {
        key: 'txt_search',
        label: 'Texto Search',
        type: 'text'
    },
    {
        key: 'meta_titulo',
        label: 'Meta Título',
        type: 'text'
    },
    {
        key: 'meta_descripcion',
        label: 'Meta Descripción',
        type: 'text'
    },
    {
        key: 'meta_keywords',
        label: 'Meta Keywords',
        type: 'text'
    },
    {
        key: 'mapa',
        label: 'Coordenadas',
        type: 'text'
    },
    {
        key: 'estado',
        label: 'Estado',
        type: 'badge'
    },
    {
        key: 'nro_orden',
        label: 'Número de Orden',
        type: 'number'
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
