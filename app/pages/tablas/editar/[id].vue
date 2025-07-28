<template>
    <DefaultSection>
        <HeadingH1>{{ getTituloForm() }}</HeadingH1>

        <FormDestinosCreate v-if="isDestinosForm()" :tipo="getDestinoTipo()" :is-editing="true"
            :editing-data="editingData" @success="handleSuccess" @cancel="handleCancel" />

        <FormCategoriasCreate v-else-if="isCategoriasForm()" :form-data="formData" :errors="errors"
            :select-options="selectOptions" :loading-options="loadingOptions" :badge-options="badgeOptions"
            :is-submitting="isSubmitting" :boton-texto="botonTexto" :details-columns="tabla.columns"
            @submit="handleSubmit" @cancel="handleCancel" />

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
                    </template>
                </FormFieldsContainer>
            </template>

            <div class="flex justify-center items-center flex-wrap gap-8 mt-3">
                <ButtonPrimary @click="handleCancel" class="!bg-gray-mid !text-dark">
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
            <p class="text-dark">No se pudo cargar la configuración de la tabla o el elemento.</p>
            <NuxtLink :to="`${ROUTE_NAMES.TABLAS}/${tablaSlug}`" class="text-primary underline">
                Volver a la tabla
            </NuxtLink>
        </div>
    </DefaultSection>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

const route = useRoute()
const router = useRouter()

const tablaSlug = route.query.tabla
const itemId = route.params.id

if (!tablaSlug || !itemId) {
    await router.push(ROUTE_NAMES.TABLAS)
}

const editingData = ref(null)

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

const isDestinosForm = () => {
    return tablaSlug === 'destinos' || route.query.tipo === 'region' || route.query.tipo === 'pais'
}

const isCategoriasForm = () => {
    return tablaSlug === 'categorias'
}

const getDestinoTipo = () => {
    if (route.query.tipo) {
        return route.query.tipo
    }

    if (editingData.value) {
        if (editingData.value.regionId) {
            return 'pais'
        } else {
            return 'region'
        }
    }

    return 'destino'
}

const getTituloForm = () => {
    if (isDestinosForm()) {
        const tipo = getDestinoTipo()
        if (tipo === 'region') return 'Editar región'
        if (tipo === 'pais') return 'Editar país'
        return 'Editar destino'
    }
    if (isCategoriasForm()) {
        return 'Editar categoría'
    }
    return botonTexto.value || 'Editar elemento'
}

const handleSuccess = () => {
    if (isDestinosForm()) {
        const tipo = getDestinoTipo()
        if (tipo === 'region') {
            router.push(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.DESTINOS_REGIONES}`)
        } else if (tipo === 'pais') {
            router.push(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.DESTINOS_PAISES}`)
        } else {
            router.push(`${ROUTE_NAMES.TABLAS}${ROUTE_NAMES.DESTINOS}`)
        }
    } else {
        router.push(`${ROUTE_NAMES.TABLAS}/${tablaSlug}`)
    }
}

const handleCancel = () => {
    handleSuccess()
}

const botonTexto = computed(() => {
    if (isDestinosForm()) {
        return getTituloForm()
    }
    if (isCategoriasForm()) {
        return 'Actualizar categoría'
    }
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
        // PUT

        await router.push(`${ROUTE_NAMES.TABLAS}/${tablaSlug}`)

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

        if (isDestinosForm() && formData.value) {
            editingData.value = { ...formData.value }
        }
    }
})
</script>