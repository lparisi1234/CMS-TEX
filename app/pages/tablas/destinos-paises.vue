<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>Países</HeadingH1>

        <ButtonPrimary @click="handleCreate" class="!px-4 sm:!px-12">Crear nuevo país</ButtonPrimary>

        <TableLayout :data="paisesData" :columns="paisesColumns" :related-data="relatedData"
            empty-state-text="No hay países creados" table-name="Países" @edit="handleEdit" @delete="handleDelete" />
    </DefaultSection>
</template>

<script setup>
import destinosData from '~/shared/destinos/destinos.js'
import expertosData from '~/shared/expertos/expertos.js'
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

const paisesData = computed(() => {
    return destinosData.filter(destino => destino.regionId)
})

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
        key: 'codigo_newton',
        label: 'Código Newton',
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
        relatedTable: 'expertos',
        displayField: 'nombre'
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
        key: 'regionId',
        label: 'Región',
        type: 'select',
        relatedTable: 'regiones'
    }
]

const relatedData = ref({
    regiones: destinosData.filter(destino => !destino.regionId),
    expertos: expertosData
})

const handleCreate = () => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.CREAR}?tabla=destinos&tipo=pais`)
}

const handleEdit = (item) => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.EDITAR}/${item.id}?tabla=destinos&tipo=pais`)
}

const handleDelete = async (item) => {
    try {
        // DELETE
    } catch (error) {
        console.error('Error al eliminar:', error)
    }
}
</script>
