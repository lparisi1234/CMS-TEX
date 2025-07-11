<template>
    <header class="flex justify-center">
        <NuxtLink :to="ROUTE_NAMES.HOME">
            <NuxtImg src="/images/Logo-Tour-Experto.svg" alt="Logo Tour Experto" />
        </NuxtLink>
    </header>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES';
</script>