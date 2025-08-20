<template>
    <DefaultSection>
        <HeadingH1>Home</HeadingH1>
        
        <!-- Ejemplo de uso del endpoint testdb -->
        <div class="mt-8 p-4 bg-blue-50 rounded-lg">
            <h2 class="text-lg font-semibold text-blue-800 mb-4">Estado de la Base de Datos</h2>
            
            <div v-if="dbPending" class="text-blue-600">
                Verificando conexión...
            </div>
            
            <div v-else-if="dbData?.success" class="text-green-600 flex items-center space-x-2">
                <span>✅</span>
                <span>Base de datos conectada</span>
                <span class="text-sm text-gray-500">({{ dbData.time.now }})</span>
            </div>
            
            <div v-else class="text-red-600 flex items-center space-x-2">
                <span>❌</span>
                <span>Error de conexión a la base de datos</span>
            </div>
            
            <button 
                @click="refreshDb" 
                class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                :disabled="dbPending"
            >
                {{ dbPending ? 'Verificando...' : 'Verificar Conexión' }}
            </button>
        </div>
    </DefaultSection>
</template>

<script setup>
// Ejemplo de uso del endpoint /api/testdb en la página principal
const { data: dbData, pending: dbPending, refresh: refreshDb } = await useLazyFetch('/api/testdb')
</script>