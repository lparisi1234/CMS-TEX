<template>
    <header class="flex justify-center bg-secondary p-6">
        <NuxtLink :to="ROUTE_NAMES.LOGIN">
            <NuxtImg src="/images/Logo-Tour-Experto.svg" alt="Logo Tour Experto" class="h-8 lg:h-12" />
        </NuxtLink>
    </header>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES';
</script>