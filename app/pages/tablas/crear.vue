<template>
    <DefaultSection>
        <HeadingH1>{{ getTituloForm() }}</HeadingH1>

        <FormDestinosCreate v-if="isDestinosForm()" :tipo="route.query.tipo" @success="handleSuccess"
            @cancel="handleCancel" />

        <FormProductosCreate v-else-if="isProductosForm()" @success="handleSuccess" @cancel="handleCancel" />

        <FormCategoriasCreate v-else-if="isCategoriasForm()" ref="categoriasCreateRef" :formData="formData"
            :errors="errors" :selectOptions="selectOptions" :loadingOptions="loadingOptions"
            :badgeOptions="badgeOptions" :isSubmitting="isSubmitting" :botonTexto="botonTexto"
            :detailsColumns="tabla?.columns || []" @submit="handleCategoriaSubmit" @cancel="handleCancel" />

        <FormLayout @submit="handleSubmit" v-else-if="tabla" class="flex flex-col gap-5">
            <template v-for="(chunk, chunkIndex) in columnChunks" :key="`chunk-${chunkIndex}`">
                <FormFieldsContainer>
                    <template v-for="column in chunk" :key="column.key">
                        <FormTextField v-if="column.type === 'text'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" :placeholder="`Ingresa ${column.label.toLowerCase()}`" />

                        <FormTextareaField v-else-if="column.type === 'textarea'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" :placeholder="`Ingresa ${column.label.toLowerCase()}`"
                            :rows="4" />

                        <FormTextField v-else-if="column.type === 'number'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" type="number"
                            :placeholder="`Ingresa ${column.label.toLowerCase()}`" />

                        <FormDateField v-else-if="column.type === 'date'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" />

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

                        <FormCheckboxGroupField v-else-if="column.type === 'checkbox-multiple'"
                            :id="`field-${column.key}`" v-model="formData[column.key]" :label="column.label"
                            :required="column.required" :error="errors[column.key]"
                            :options="selectOptions[column.key] || []" :loading="loadingOptions[column.key]" />

                        <FormSelectField v-else-if="column.type === 'select'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" :options="selectOptions[column.key] || []"
                            :loading="loadingOptions[column.key]"
                            :placeholder="`Seleccionar ${column.label.toLowerCase()}`" />

                        <FormSelectField v-else-if="column.type === 'badge'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" :options="badgeOptions"
                            :placeholder="`Seleccionar ${column.label.toLowerCase()}`" />

                        <FormImageField v-else-if="column.type === 'image'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" />

                        <FormFileField v-else-if="column.type === 'file'" :id="`field-${column.key}`"
                            v-model="formData[column.key]" :label="column.label" :required="column.required"
                            :error="errors[column.key]" />
                    </template>
                </FormFieldsContainer>
            </template>

            <div class="flex justify-center flex-wrap items-center gap-5 mt-8">
                <ButtonPrimary @click="handleCancel" type="button" class="!bg-gray-mid !text-dark">
                    Cancelar
                </ButtonPrimary>

                <ButtonPrimary type="submit" :disabled="isSubmitting" class="">
                    {{ isSubmitting ? 'Creando...' : 'Crear' }}
                </ButtonPrimary>
            </div>

        </FormLayout>

        <div v-else class="text-center py-8">
            <p class="text-dark">No se pudo cargar la configuración de la tabla.</p>
            <NuxtLink :to="ROUTE_NAMES.HOME" class="text-primary underline">
                Volver a la Home
            </NuxtLink>
        </div>
    </DefaultSection>
</template>

<script setup>
import { useDynamicForm } from '~/composables/useDynamicForm'
import { ButtonPrimary } from '#components'
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

const route = useRoute()
const router = useRouter()

const tablaSlug = route.query.tabla
const categoriasCreateRef = ref(null)

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
    createItem
} = useDynamicForm(tablaSlug)

const botonTexto = computed(() => tabla?.botonTexto || 'Crear nuevo elemento')

const isDestinosForm = () => {
    return tablaSlug === 'destinos' || route.query.tipo === 'region' || route.query.tipo === 'pais'
}

const isProductosForm = () => {
    return tablaSlug === 'productos'
}

const isCategoriasForm = () => {
    return tablaSlug === 'categorias'
}

const getTituloForm = () => {
    if (isDestinosForm()) {
        const tipo = route.query.tipo
        if (tipo === 'region') return 'Crear nueva región'
        if (tipo === 'pais') return 'Crear nuevo país'
        return 'Crear nuevo destino'
    }
    if (isProductosForm()) return 'Crear nuevo producto'
    if (isCategoriasForm()) return 'Crear nueva categoría'
    return botonTexto.value || 'Crear nuevo elemento'
}

const handleSuccess = () => {
    if (isDestinosForm()) {
        const tipo = route.query.tipo
        if (tipo === 'region') {
            router.push(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.DESTINOS_REGIONES}`)
        } else if (tipo === 'pais') {
            router.push(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.DESTINOS_PAISES}`)
        } else {
            router.push(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.DESTINOS}`)
        }
    } else if (isProductosForm()) {
        router.push(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.PRODUCTOS}`)
    } else if (isCategoriasForm()) {
        router.push(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.CATEGORIAS}`)
    } else {
        router.push(`${ROUTE_NAMES.TABLAS}/${tablaSlug}`)
    }
}

const handleCancel = () => {
    handleSuccess()
}

const handleSubmit = async () => {
    const success = await createItem()
    if (success) {
        await router.push(`${ROUTE_NAMES.TABLAS}/${tablaSlug}`)
    }
}

const handleCategoriaSubmit = async () => {
    const result = await createItem()
    if (result && result.success) {
        if (categoriasCreateRef.value && categoriasCreateRef.value.onCategoriaCreated) {
            await categoriasCreateRef.value.onCategoriaCreated(result)
        }
        await router.push(`${ROUTE_NAMES.TABLAS}/${tablaSlug}`)
    }
}

onMounted(async () => {
    if (tabla) {
        initializeFormData()
        await loadSelectOptions()
    }
})
</script>