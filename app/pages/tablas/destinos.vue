<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>Gestión de Destinos</HeadingH1>
        
        <!-- Barra de búsqueda -->
        <div class="w-full max-w-2xl">
            <div class="relative">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Buscar en destinos y ciudades..."
                    class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    @input="handleSearch"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>
            
            <!-- Resultados de búsqueda -->
            <div v-if="searchQuery && searchResults.length > 0" class="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm max-h-64 overflow-y-auto">
                <div v-for="result in searchResults" :key="`${result.type}-${result.id}`" 
                     class="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                     @click="goToResult(result)">
                    <div class="flex justify-between items-center">
                        <div>
                            <span class="font-medium">{{ result.nombre }}</span>
                            <span class="ml-2 text-xs px-2 py-1 rounded" 
                                  :class="result.type === 'destino' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
                                {{ result.type === 'destino' ? 'Destino' : 'Ciudad' }}
                            </span>
                        </div>
                        <div class="text-sm text-gray-500">
                            {{ result.type === 'destino' ? (result.regionId ? 'País' : 'Región') : `País ID: ${result.paises_id}` }}
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-else-if="searchQuery && searchResults.length === 0" class="mt-4 p-4 bg-gray-50 rounded-lg">
                <p class="text-gray-500 text-center">No se encontraron resultados para "{{ searchQuery }}"</p>
            </div>
        </div>
        
        <!-- Botones de navegación -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div class="text-center">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Regiones</h3>
                    <p class="text-gray-600 mb-4">Gestionar continentes y regiones</p>
                    <ButtonPrimary @click="goToRegiones" class="w-full">
                        Ver Regiones
                    </ButtonPrimary>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div class="text-center">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Países</h3>
                    <p class="text-gray-600 mb-4">Gestionar países y destinos nacionales</p>
                    <ButtonPrimary @click="goToPaises" class="w-full">
                        Ver Países
                    </ButtonPrimary>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div class="text-center">
                    <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Ciudades</h3>
                    <p class="text-gray-600 mb-4">Gestionar ciudades y destinos urbanos</p>
                    <ButtonPrimary @click="goToCiudades" class="w-full">
                        Ver Ciudades
                    </ButtonPrimary>
                </div>
            </div>
        </div>
    </DefaultSection>
</template>

<script setup>
import destinosData from '~/shared/destinos/destinos.js'
import ciudadesData from '~/shared/ciudades/ciudades.js'

const searchQuery = ref('')
const searchResults = ref([])

const handleSearch = () => {
    if (!searchQuery.value.trim()) {
        searchResults.value = []
        return
    }
    
    const query = searchQuery.value.toLowerCase()
    const results = []
    
    // Buscar en destinos
    destinosData.forEach(destino => {
        if (destino.nombre.toLowerCase().includes(query) || 
            destino.txt_search.toLowerCase().includes(query)) {
            results.push({
                ...destino,
                type: 'destino'
            })
        }
    })
    
    // Buscar en ciudades
    ciudadesData.forEach(ciudad => {
        if (ciudad.nombre.toLowerCase().includes(query)) {
            results.push({
                ...ciudad,
                type: 'ciudad'
            })
        }
    })
    
    searchResults.value = results.slice(0, 10) // Limitar a 10 resultados
}

const goToResult = (result) => {
    if (result.type === 'destino') {
        if (result.regionId) {
            navigateTo('/tablas/destinos-paises')
        } else {
            navigateTo('/tablas/destinos-regiones')
        }
    } else {
        navigateTo('/tablas/ciudades')
    }
}

const goToRegiones = () => {
    navigateTo('/tablas/destinos-regiones')
}

const goToPaises = () => {
    navigateTo('/tablas/destinos-paises')
}

const goToCiudades = () => {
    navigateTo('/tablas/ciudades')
}
</script>
