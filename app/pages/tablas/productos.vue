<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>Productos</HeadingH1>
        <ButtonPrimary @click="handleCreate" class="!px-4 sm:!px-12">Crear nuevo producto</ButtonPrimary>
        <div class="w-full max-w-md">
            <div class="flex flex-col gap-1">
                <FormLabel>Busca un producto por su ID</FormLabel>
                <div class="relative">
                    <FormTextField id="search" v-model="searchId" type="number" placeholder="3/2500257"
                        @input="handleSearchById" />
                    <div class="flex items-center absolute top-1/2 right-0 transform -translate-y-1/2 pr-3">
                        <Icon name="tabler:search" class="w-5 h-5 text-gray-dark" />
                    </div>
                </div>
            </div>

            <div v-if="searchId && foundProduct" class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mt-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-semibold">{{ foundProduct.nombreprod }}</h3>
                        <p class="text-sm text-gray-600">ID: {{ foundProduct.id }}</p>
                        <p class="text-sm text-gray-600">Código Newton: {{ foundProduct.codigo_newton }}</p>
                    </div>
                    <div class="flex gap-2">
                        <button @click="handleEdit(foundProduct)"
                            class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                            Editar
                        </button>
                        <button @click="handleDelete(foundProduct)"
                            class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>

            <div v-else-if="searchId && !foundProduct" class="mt-4 p-4 bg-gray-50 rounded-lg">
                <p class="text-gray-500 text-center">No se encontró ningún producto con ID "{{ searchId }}"</p>
            </div>
        </div>
    </DefaultSection>
</template>

<script setup>
import productosData from '~/shared/productos/productos.js'
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

const searchId = ref('')
const foundProduct = ref(null)

const handleSearchById = () => {
    if (!searchId.value || !productosData) {
        foundProduct.value = null
        return
    }

    const id = parseInt(searchId.value)
    foundProduct.value = productosData.find(producto => producto.id === id) || null
}

const handleCreate = () => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.CREAR}?tabla=productos`)
}

const handleEdit = (item) => {
    navigateTo(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.EDITAR}/${item.id}?tabla=productos`)
}

const handleDelete = async (item) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el producto "${item.nombreprod}"?`)) {
        return
    }

    try {
        // DELETE

        // Limpiar búsqueda si el producto eliminado era el encontrado
        if (foundProduct.value && foundProduct.value.id === item.id) {
            foundProduct.value = null
            searchId.value = ''
        }
    } catch (error) {
        console.error('Error al eliminar:', error)
        alert('Error al eliminar el producto')
    }
}
</script>
