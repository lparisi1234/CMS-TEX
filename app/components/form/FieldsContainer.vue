<template>
    <div class="w-full flex flex-col lg:flex-row gap-5 lg:gap-8">
        <slot />
    </div>
</template>

<style scoped>
/* Asegurar que los elementos hijos ocupen la mitad del espacio en desktop */
@media (min-width: 1024px) {
    :slotted(*) {
        flex: 1;
        max-width: calc(50% - 1rem);
    }
    
    /* Si solo hay un elemento, que ocupe solo la mitad */
    :slotted(:only-child) {
        max-width: 50%;
    }
}
</style>