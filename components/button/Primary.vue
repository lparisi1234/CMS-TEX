<template>
    <NuxtLink v-if="to" :to="to"
        class="h-12 flex justify-center items-center bg-primary rounded-[0.625rem] shadow-1 text-light lg:text-xl font-medium transition duration-300 cursor-pointer py-3 px-12">
        <slot />
    </NuxtLink>
    <button v-else type="button"
        class="h-12 flex justify-center items-center bg-primary rounded-[0.625rem] shadow-1 text-light lg:text-xl font-medium transition duration-300 cursor-pointer py-3 px-12">
        <slot />
    </button>
</template>

<script setup>
defineProps({
    to: {
        type: [String, Object],
        default: null
    }
})
</script>