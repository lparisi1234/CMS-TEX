<template>
    <div v-if="column.type === 'image'" class="flex items-center justify-center">
        <img :src="value" :alt="column.label" class="w-16 h-16 object-cover rounded-lg" />
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
            return new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: column.currency || 'ARS'
            }).format(value)

        case 'date':
            if (!value) return '-'
            return value.toString().split('T')[0].split('-').reverse().join('/')

        case 'datetime':
            if (!value) return '-'
            const [datePart, timePart] = value.toString().split('T')
            const formattedDate = datePart.split('-').reverse().join('/')
            const formattedTime = timePart ? timePart.substring(0, 5) : ''
            return timePart ? `${formattedDate} ${formattedTime}` : formattedDate

        case 'number':
            return new Intl.NumberFormat('es-AR').format(value)

        case 'boolean':
            return value ? 'Sí' : 'No'

        case 'image':
            return value

        default:
            return value
    }
}
</script>