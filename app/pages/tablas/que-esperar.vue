<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>Qué Esperar Categorías</HeadingH1>
        <ButtonPrimary @click="handleCreate" class="!px-4 sm:!px-12">
            Agregar Qué Esperar
        </ButtonPrimary>
        <div class="w-full lg:w-[37.5rem] flex items-end gap-4">
            <div class="w-full flex flex-col gap-1">
                <FormLabel>Selecciona una categoría</FormLabel>
                <FormSelectField v-model="selectedCategoriaId" :options="categoriaOptions"
                    placeholder="Selecciona una categoría" />
            </div>
            <div class="flex gap-2">
                <ButtonPrimary @click="handleSearch" :disabled="!selectedCategoriaId"
                    class="h-[3.375rem] !px-4 sm:!px-12">
                    Buscar
                </ButtonPrimary>
            </div>
        </div>

        <div v-if="showResults">
            <TableLayout :data="filteredData" :columns="columns" :related-data="relatedData"
                :empty-state-text="`No hay elementos de 'Qué Esperar' para la categoría ${selectedCategoriaName}`"
                table-name="Qué esperar" @edit="handleEdit" @delete="handleDelete" />
        </div>
    </DefaultSection>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

const { success, error } = useNotification()

const tabla = {
    name: 'Qué esperar Categorías',
    slug: 'que-esperar-categorias',
    endpoint: 'que-esperar-categorias/que-esperar-categorias',
    botonTexto: 'Crear nuevo Que Esperar',
    columns: [
        {
            key: 'id',
            label: 'ID',
            type: 'number',
            required: true
        },
        {
            key: 'titulo',
            label: 'Título',
            type: 'text',
            required: true
        },
        {
            key: 'descripcion',
            label: 'Texto',
            type: 'text',
            required: true
        },
        {
            key: 'img',
            label: 'Imagen',
            type: 'image',
            required: true
        },
        {
            key: 'nro_orden',
            label: 'Número de Orden',
            type: 'number',
            required: true
        },
        {
            key: 'categoria_id',
            label: 'Categoría',
            type: 'select',
            relatedTable: 'categorias',
            required: true
        }
    ]
}

const selectedCategoriaId = ref('')
const selectedCategoriaName = ref('')
const showResults = ref(false)

const queEsperarData = ref([])
const categoriasData = ref([])

const loadData = async () => {
    try {
        const [queEsperarResponse, categoriasResponse] = await Promise.all([
            $fetch('/api/que-esperar-categorias/que-esperar-categorias'),
            $fetch('/api/categorias/categorias')
        ])

        queEsperarData.value = queEsperarResponse || []
        categoriasData.value = categoriasResponse || []
    } catch (err) {
        console.error('Error cargando datos:', err)
        error('Error al cargar los datos')
    }
}

onMounted(() => {
    loadData()
})

const categoriaOptions = computed(() => {
    return categoriasData.value.map(categoria => ({
        value: categoria.id.toString(),
        label: categoria.nombre
    }))
})

const filteredData = computed(() => {
    if (!selectedCategoriaId.value) return []

    return queEsperarData.value.filter(item =>
        (item.categoria_id ?? item.categoriaId)?.toString() === selectedCategoriaId.value
    )
})

const relatedData = computed(() => ({
    categorias: categoriasData.value
}))

const columns = tabla.columns

const handleSearch = () => {
    if (!selectedCategoriaId.value) return

    const categoria = categoriasData.value.find(cat =>
        cat.id.toString() === selectedCategoriaId.value
    )

    if (categoria) {
        selectedCategoriaName.value = categoria.nombre
        showResults.value = true
    }
}

const handleCreate = () => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.CREAR}?tabla=${tabla.slug}`)
}

const handleEdit = (item) => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.EDITAR}/${item.id}?tabla=${tabla.slug}`)
}

const handleDelete = async (item) => {
    try {
        await $fetch('/api/que-esperar-categorias/delete', {
            method: 'POST',
            body: { id: item.id }
        })

        // Recargar datos
        await loadData()
        success('Elemento eliminado exitosamente')
    } catch (err) {
        console.error('Error al eliminar:', err)
        error('Error al eliminar el elemento')
    }
}
</script>
