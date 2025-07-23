<template>
    <DefaultSection>
        <HeadingH1>{{ botonTexto || 'Editar elemento' }}</HeadingH1>

        <FormLayout @submit="handleSubmit" v-if="tabla" class="flex flex-col gap-5">
            <template v-for="(chunk, chunkIndex) in columnChunks" :key="`chunk-${chunkIndex}`">
                <FormFieldsContainer>
                    <template v-for="column in chunk" :key="column.key">
                        <FormTextField v-if="column.type === 'text'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" :placeholder="`Ingresa ${column.label.toLowerCase()}`" />

                        <FormTextField v-else-if="column.type === 'number'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" type="number"
                            :placeholder="`Ingresa ${column.label.toLowerCase()}`" />

                        <FormTextField v-else-if="column.type === 'date'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" type="date" />

                        <FormTextField v-else-if="column.type === 'datetime'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" type="datetime-local" />

                        <FormTextField v-else-if="column.type === 'currency'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" type="number" step="0.01"
                            :placeholder="`Ingresa ${column.label.toLowerCase()}`" />

                        <FormSwitchField v-else-if="column.type === 'boolean'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" />

                        <FormSelectField v-else-if="column.type === 'select'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required" 
                            :error="errors[column.key]" :options="selectOptions[column.key] || []" 
                            :loading="loadingOptions[column.key]" :placeholder="`Seleccionar ${column.label.toLowerCase()}`" />

                        <FormSelectField v-else-if="column.type === 'badge'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required" 
                            :error="errors[column.key]" :options="badgeOptions" 
                            :placeholder="`Seleccionar ${column.label.toLowerCase()}`" />

                        <FormImageField v-else-if="column.type === 'image'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" />
                    </template>
                </FormFieldsContainer>
            </template>

            <div class="flex justify-center items-center flex-wrap gap-8 mt-3">
                <ButtonPrimary :to="`/tablas/${tablaSlug}`" class="!bg-gray-mid !text-dark">
                    Cancelar
                </ButtonPrimary>
                <ButtonPrimary type="submit" :disabled="isSubmitting">
                    <span v-if="!isSubmitting">Actualizar</span>
                    <span v-else class="flex items-center gap-2">
                        <Icon name="tabler:loader-2" class="animate-spin" />
                        Actualizando...
                    </span>
                </ButtonPrimary>
            </div>
        </FormLayout>

        <div v-else-if="loadingData" class="text-center py-8">
            <div class="flex items-center justify-center gap-2">
                <Icon name="tabler:loader-2" class="animate-spin" />
                <span>Cargando datos...</span>
            </div>
        </div>

        <div v-else class="text-center py-8">
            <p class="text-gray-600">No se pudo cargar la configuración de la tabla o el elemento.</p>
            <NuxtLink :to="`/tablas/${tablaSlug}`" class="text-blue-600 hover:text-blue-800 underline">
                Volver a la tabla
            </NuxtLink>
        </div>
    </DefaultSection>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const tablaSlug = route.query.tabla
const itemId = route.params.id

if (!tablaSlug || !itemId) {
    await router.push('/tablas')
}

const {
    formData,
    errors,
    selectOptions,
    loadingOptions,
    isSubmitting,
    loadingData,
    tabla,
    badgeOptions,
    columnChunks,
    initializeFormData,
    loadSelectOptions,
    validateForm,
    prepareDataForSubmit,
    loadExistingData
} = useDynamicForm(tablaSlug, itemId)

const botonTexto = computed(() => {
    if (tabla?.botonTexto) {
        return tabla.botonTexto.replace('Crear', 'Editar')
    }
    return 'Editar elemento'
})

const handleSubmit = async () => {
    if (!validateForm()) return

    isSubmitting.value = true

    try {
        const dataToSubmit = prepareDataForSubmit()
        console.log('Datos a actualizar:', dataToSubmit)

        await router.push(`/tablas/${tablaSlug}`)

    } catch (error) {
        console.error('Error al actualizar:', error)
    } finally {
        isSubmitting.value = false
    }
}

onMounted(async () => {
    if (tabla) {
        await loadSelectOptions()
        await loadExistingData()
    }
})
</script>