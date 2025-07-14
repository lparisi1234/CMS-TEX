<template>
    <label :for="id" class="text-dark font-light lg:text-xl">
        <slot />
    </label>
</template>

<script setup>
defineProps({
    id: {
        type: String,
        required: true
    }
})
</script>