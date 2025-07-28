<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>Productos</HeadingH1>
        <ButtonPrimary @click="handleCreate" class="!px-4 sm:!px-12">
            Crear nuevo producto
        </ButtonPrimary>

        <div class="w-full max-w-md">
            <div class="flex flex-col gap-1">
                <FormLabel>Busca un producto por su Código Newton</FormLabel>
                <div class="relative">
                    <FormTextField id="search" v-model="searchCodigoNewton" type="text" placeholder="3/2500254"
                        @input="handleSearchByCodigoNewton" />
                    <div class="flex items-center absolute top-1/2 right-0 transform -translate-y-1/2 pr-3">
                        <Icon name="tabler:search" class="w-5 h-5 text-gray-dark" />
                    </div>
                </div>
            </div>

            <div v-if="searchCodigoNewton && filteredProductos.length > 0" class="flex flex-col gap-2 mt-4">
                <div v-for="producto in filteredProductos.slice(0, 10)" :key="producto.codigo_newton"
                    class="flex justify-between items-center bg-white border rounded-lg shadow-sm p-4">
                    <div>
                        <p class="font-semibold">{{ producto.nombreprod }}</p>
                        <p class="text-sm text-gray-dark">Código Newton: {{ producto.codigo_newton }}</p>
                    </div>
                    <div class="flex gap-2">
                        <button @click="handleEdit(producto)" class="bg-secondary text-light rounded text-sm px-3 py-2">
                            Editar
                        </button>
                        <button @click="openDeleteModal(producto)"
                            class="bg-primary text-light rounded text-sm px-3 py-2">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>

            <div v-else-if="searchCodigoNewton && filteredProductos.length === 0"
                class="bg-gray-dark rounded-lg mt-4 p-4">
                <p class="text-dark text-center">No se encontró ningún producto con ese código</p>
            </div>
        </div>
    </DefaultSection>

    <ModalDelete v-if="showDeleteModal" :isOpen="showDeleteModal" :itemName="productoAEliminar?.nombreprod"
        tableName="producto" @cancel="closeDeleteModal" @confirm="confirmDelete" />
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'
import productosData from '~/shared/productos/productos.js'

const searchCodigoNewton = ref('')
const productos = ref([...productosData])

const filteredProductos = computed(() => {
    if (!searchCodigoNewton.value) return []

    const searchValue = searchCodigoNewton.value.toString().toLowerCase()

    return productos.value.filter(producto => {
        const codigoNewton = producto.codigo_newton?.toString().toLowerCase() || ''
        const nombre = producto.nombreprod?.toLowerCase() || ''

        return codigoNewton.includes(searchValue) || nombre.includes(searchValue)
    })
})

const handleSearchByCodigoNewton = () => {
}

const handleCreate = () => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.CREAR}?tabla=productos`)
}

const handleEdit = (item) => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.EDITAR}/${item.id}?tabla=productos`)
}

const showDeleteModal = ref(false)
const productoAEliminar = ref(null)

const openDeleteModal = (producto) => {
    productoAEliminar.value = producto
    showDeleteModal.value = true
}

const closeDeleteModal = () => {
    showDeleteModal.value = false
    productoAEliminar.value = null
}

const confirmDelete = () => {
    const index = productos.value.findIndex(p =>
        p.id === productoAEliminar.value.id
    )

    if (index > -1) {
        productos.value.splice(index, 1)
    }

    closeDeleteModal()
}
</script>