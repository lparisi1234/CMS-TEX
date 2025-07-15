<template>
    <div v-if="column.type === 'image'" class="flex items-center justify-center">
        <img 
            :src="value" 
            :alt="column.label" 
            class="w-16 h-16 object-cover rounded-lg"
            @error="handleImageError"
        />
    </div>
    <span v-else>{{ formatValue(value, column) }}</span>
</template>

<script setup>
const props = defineProps({
    value: {
        type: [String, Number, Boolean, Date, Object],
        default: null
    },
    column: {
        type: Object,
        required: true
    }
})

const formatValue = (value, column) => {
    if (value === null || value === undefined) return '-'

    switch (column.type) {
        case 'currency':
            return new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: column.currency || 'EUR'
            }).format(value)

        case 'date':
            return new Date(value).toLocaleDateString('es-ES')

        case 'datetime':
            return new Date(value).toLocaleString('es-ES')

        case 'number':
            return new Intl.NumberFormat('es-ES').format(value)

        case 'boolean':
            return value ? 'Sí' : 'No'

        case 'image':
            return value // Para imágenes, devolvemos el valor tal como está

        default:
            return value
    }
}

const handleImageError = (event) => {
    // Si la imagen no se puede cargar, mostrar una imagen placeholder
    event.target.src = '/images/placeholder.png'
    event.target.alt = 'Imagen no disponible'
}
</script>