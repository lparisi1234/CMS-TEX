<template>
    <div class="w-full flex flex-col gap-2">
        <FormLabel v-if="label" :required="required" class="lg:text-xl font-light text-dark">
            {{ label }}
        </FormLabel>

        <div class="flex flex-wrap justify-between gap-y-3" v-if="options && options.length > 0">
            <FormCheckboxField class="w-[48%]" v-for="option in options" :key="option.value" :id="`${id}-${option.value}`"
                :label="option.label" :modelValue="isOptionSelected(option.value)"
                @update:modelValue="(checked) => handleOptionChange(option.value, checked)" :error="option.error"
                label-position="right" />
        </div>

        <div v-else-if="loading" class="text-sm text-gray-500">
            Cargando opciones...
        </div>

        <div v-else class="text-sm text-gray-500">
            No hay opciones disponibles
        </div>

        <FormError v-if="error && showError">{{ error }}</FormError>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: [Array, String],
        default: () => []
    },
    label: {
        type: String,
        default: ''
    },
    error: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'change'])

const showError = ref(false)

const selectedValues = computed(() => {
    if (Array.isArray(props.modelValue)) {
        return props.modelValue
    }
    if (typeof props.modelValue === 'string' && props.modelValue) {
        return props.modelValue.split(',').map(v => v.trim()).filter(Boolean)
    }
    return []
})

// Comparar valores de forma flexible (número vs string)
const isOptionSelected = (value) => {
    return selectedValues.value.some(v => {
        // Comparar como números si ambos son convertibles a número
        const vNum = Number(v)
        const valueNum = Number(value)
        if (!isNaN(vNum) && !isNaN(valueNum)) {
            return vNum === valueNum
        }
        // Si no, comparar como strings
        return String(v) === String(value)
    })
}

const handleOptionChange = (value, checked) => {
    let newValues = [...selectedValues.value]
    
    if (checked) {
        // Agregar si no existe (comparando de forma flexible)
        const exists = newValues.some(v => {
            const vNum = Number(v)
            const valueNum = Number(value)
            if (!isNaN(vNum) && !isNaN(valueNum)) {
                return vNum === valueNum
            }
            return String(v) === String(value)
        })
        
        if (!exists) {
            // Mantener el tipo del valor original (número si es número)
            newValues.push(typeof value === 'number' ? value : Number(value))
        }
    } else {
        // Quitar (comparando de forma flexible)
        newValues = newValues.filter(v => {
            const vNum = Number(v)
            const valueNum = Number(value)
            if (!isNaN(vNum) && !isNaN(valueNum)) {
                return vNum !== valueNum
            }
            return String(v) !== String(value)
        })
    }

    emit('update:modelValue', newValues)
    emit('change', newValues)

    if (showError.value) {
        showError.value = false
    }
}

watchEffect(() => {
    if (props.error) {
        showError.value = true
    }
})

const focus = () => {
    const firstCheckbox = document.querySelector(`#${props.id}-${props.options[0]?.value}`)
    if (firstCheckbox) {
        firstCheckbox.focus()
    }
}

const clear = () => {
    emit('update:modelValue', [])
    emit('change', [])
}

defineExpose({
    focus,
    clear
})
</script>
