<template>
    <div class="w-full flex flex-col gap-2">
        <FormLabel v-if="label">{{ label }}</FormLabel>

        <input :id="inputId" :type="type" :placeholder="placeholder" :value="modelValue" :required="required"
            @input="handleInput" @blur="handleBlur" @focus="handleFocus" :autocomplete="autocomplete" class="bg-light border border-dark rounded-[5px] outline-none lg:text-xl font-light text-dark lg:placeholder:text-xl placeholder:font-light placeholder:text-gray py-3 px-[0.875rem]" />

        <FormError v-if="error && showError">{{ error }}</FormError>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'text'
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
    autocomplete: {
        type: String,
        default: 'off'
    }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const showError = ref(false)

const inputId = computed(() => props.id)


const handleInput = (event) => {
    emit('update:modelValue', event.target.value)

    if (showError.value) {
        showError.value = false
    }
}

const handleBlur = (event) => {
    if (props.error) {
        showError.value = true
    }
    emit('blur', event)
}

const handleFocus = (event) => {
    emit('focus', event)
}

watchEffect(() => {
    if (props.error) {
        showError.value = true
    }
})
</script>