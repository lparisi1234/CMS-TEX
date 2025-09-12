<template>
    <DefaultSection class="lg:!gap-8">
        <HeadingH1>Traducciones</HeadingH1>
        <div class="flex justify-center flex-wrap gap-8">
            <ButtonPrimary :to="`${ROUTE_NAMES.TABLAS}/personalizar`">Personalizar</ButtonPrimary>
            <ButtonPrimary :to="`${ROUTE_NAMES.TABLAS}/categoria_hotelera`">Categoría Hotelera</ButtonPrimary>
        </div>
    </DefaultSection>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'
</script>
