<template>
    <header class="flex justify-center relative bg-secondary p-6 lg:px-24">
        <HeaderNav />
        <NuxtLink :to="ROUTE_NAMES.HOME">
            <NuxtImg src="/images/Logo-Tour-Experto.svg" alt="Logo Tour Experto" class="h-8 lg:h-12" />
        </NuxtLink>
    </header>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES';
</script>