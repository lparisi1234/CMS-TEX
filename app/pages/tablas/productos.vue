<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>Productos</HeadingH1>
        
        <!-- Barra de búsqueda por ID -->
        <div class="w-full max-w-md">
            <div class="relative">
                <input
                    v-model="searchId"
                    type="number"
                    placeholder="Buscar producto por ID..."
                    class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    @input="handleSearchById"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>
            
            <!-- Resultado de búsqueda por ID -->
            <div v-if="searchId && foundProduct" class="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
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
        
        <!-- Botón crear -->
        <ButtonPrimary @click="handleCreate" class="!px-4 sm:!px-12">Crear nuevo producto</ButtonPrimary>
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
        console.log(`Producto ${item.nombreprod} eliminado correctamente`)
        // Aquí harías la llamada a la API para eliminar
        
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
