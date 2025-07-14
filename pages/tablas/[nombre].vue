<template>
    <DefaultSection>
        <HeadingH1>{{ tabla.name || 'Tabla no encontrada' }}</HeadingH1>
    </DefaultSection>
</template>

<script setup>
import tablas from '~/shared/tablas.js'

const route = useRoute()
const nombreSlug = route.params.nombre

const getTabla = () => {
    return tablas.configuracion.find(item => item.slug === nombreSlug)
}

const tabla = getTabla()

</script>