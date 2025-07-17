<template>
    <AuthHeader />
    <DefaultMain>
        <DefaultSection class="!gap-9">
            <HeadingH1>¡Ups! Página no encontrada</HeadingH1>
            <p class="max-w-[33.75rem] text-xl font-light">
                Parece que has tomado un desvío inesperado. La página que buscas no está disponible o ha cambiado de
                dirección.
            </p>
            <ButtonPrimary :to="ROUTE_NAMES.HOME">Volver al incio</ButtonPrimary>
        </DefaultSection>
    </DefaultMain>
    <DefaultFooter />
</template>

<script setup>
import { ROUTE_NAMES } from './constants/ROUTE_NAMES';
</script>