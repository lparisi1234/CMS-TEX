<template>
    <header class="flex justify-center">
        <NuxtLink :to="ROUTE_NAMES.LOGIN">
            <NuxtImg src="/images/Logo-Tour-Experto.svg" alt="Logo Tour Experto" />
            Auth
        </NuxtLink>
    </header>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES';
</script>