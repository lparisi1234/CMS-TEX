<template>
    <DefaultSection>
        <HeadingH1>{{ botonTexto || 'Crear nuevo elemento' }}</HeadingH1>

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

                        <FormSelectField v-else-if="column.type === 'select'" v-model="formData[column.key]"
                            :label="column.label" :required="column.required" :error="errors[column.key]"
                            :options="selectOptions[column.key] || []" :loading="loadingOptions[column.key]"
                            :placeholder="`Seleccionar ${column.label.toLowerCase()}`" />

                        <FormSelectField v-else-if="column.type === 'badge'" v-model="formData[column.key]"
                            :label="column.label" :required="column.required" :error="errors[column.key]"
                            :options="badgeOptions" :placeholder="`Seleccionar ${column.label.toLowerCase()}`" />

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
                    <span v-if="!isSubmitting">Crear</span>
                    <span v-else class="flex items-center gap-2">
                        <Icon name="tabler:loader-2" class="animate-spin" />
                        Creando...
                    </span>
                </ButtonPrimary>
            </div>
        </FormLayout>

        <div v-else class="text-center py-8">
            <p class="text-gray-600">No se pudo cargar la configuración de la tabla.</p>
            <NuxtLink to="/tablas" class="text-blue-600 hover:text-blue-800 underline">
                Volver a tablas
            </NuxtLink>
        </div>
    </DefaultSection>
</template>

<script setup>
import { useDynamicForm } from '~/composables/useDynamicForm'

const route = useRoute()
const router = useRouter()

const tablaSlug = route.query.tabla

const {
    formData,
    errors,
    selectOptions,
    loadingOptions,
    isSubmitting,
    tabla,
    badgeOptions,
    columnChunks,
    initializeFormData,
    loadSelectOptions,
    validateForm,
    prepareDataForSubmit
} = useDynamicForm(tablaSlug)

const botonTexto = computed(() => tabla?.botonTexto || 'Crear nuevo elemento')

const handleSubmit = async () => {
    if (!validateForm()) return

    isSubmitting.value = true

    try {
        const dataToSubmit = prepareDataForSubmit()
        console.log('Datos a enviar:', dataToSubmit)

        await router.push(`/tablas/${tablaSlug}`)

    } catch (error) {
        console.error('Error al crear:', error)
    } finally {
        isSubmitting.value = false
    }
}

onMounted(async () => {
    if (tabla) {
        initializeFormData()
        await loadSelectOptions()
    }
})
</script>