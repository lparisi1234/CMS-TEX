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
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

const { success, error } = useNotification()

const destinosData = ref([])
const expertosData = ref([])

const loadData = async () => {
    try {
        const [destinosResponse, expertosResponse] = await Promise.all([
            $fetch('/api/destinos/destinos'),
            $fetch('/api/expertos/expertos')
        ])

        destinosData.value = destinosResponse || []
        expertosData.value = expertosResponse || []
    } catch (err) {
        console.error('Error cargando datos:', err)
        error('Error al cargar los datos')
    }
}

onMounted(() => {
    loadData()
})

const regionesData = computed(() => {
    return destinosData.value.filter(destino => !destino.region_id)
})

const regionesColumns = [
    {
        key: 'cod_newton',
        label: 'Código Newton',
        type: 'number',
        required: true
    },
    {
        key: 'url',
        label: 'URL',
        type: 'text',
        required: true
    },
    {
        key: 'nombre',
        label: 'Nombre',
        type: 'text',
        required: true
    },
    {
        key: 'h1',
        label: 'H1',
        type: 'text',
        required: true
    },
    {
        key: 'h2',
        label: 'H2',
        type: 'text',
        required: true
    },
    {
        key: 'video_mobile',
        label: 'Video Mobile',
        type: 'image',
        size: '510px x 260px',
        required: true
    },
    {
        key: 'video_desktop',
        label: 'Video Desktop',
        type: 'image',
        size: '670px x 460px',
        required: true
    },
    {
        key: 'experto_id',
        label: 'Experto',
        type: 'select',
        relatedTable: 'expertos',
        displayField: 'nombre',
        required: true
    },
    {
        key: 'consejo_experto',
        label: 'Consejo Experto',
        type: 'text',
        required: true
    },
    {
        key: 'img',
        label: 'Imagen',
        type: 'image',
        size: '650px x 360px',
        required: true
    },
    {
        key: 'meta_titulo',
        label: 'Meta Título',
        type: 'text',
        required: true
    },
    {
        key: 'meta_descripcion',
        label: 'Meta Descripción',
        type: 'text',
        required: true
    },
    {
        key: 'meta_keywords',
        label: 'Meta Keywords',
        type: 'text',
        required: true
    },
    {
        key: 'mapa',
        label: 'Coordenadas',
        type: 'text',
        required: true
    },
    {
        key: 'estado',
        label: 'Estado',
        type: 'boolean',
        required: true
    },
    {
        key: 'nro_orden',
        label: 'Número de Orden',
        type: 'number'
    },
    {
        key: 'subgrupos',
        label: 'Subgrupos',
        type: 'array'
    },
]

const relatedData = computed(() => ({
    expertos: expertosData.value
}))

const handleCreate = () => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.CREAR}?tabla=destinos&tipo=region`)
}

const handleEdit = (item) => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.EDITAR}/${item.id}?tabla=destinos&tipo=region`)
}

const handleDelete = async (item) => {
    try {
        await $fetch('/api/destinos/delete', {
            method: 'POST',
            body: { id: item.id }
        })

        await loadData()
        success('Región eliminada exitosamente')
    } catch (err) {
        console.error('Error al eliminar:', err)
        error('Error al eliminar la región')
    }
}
</script>