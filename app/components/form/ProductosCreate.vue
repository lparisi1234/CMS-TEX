<template>
    <FormLayout @submit="handleSubmit" class="flex flex-col gap-5">
        <FormFieldsContainer>
            <FormTextField
                v-model="formData.nombreprod"
                label="Nombre del Producto"
                required
                placeholder="Ingresa el nombre del producto"
                :error="errors.nombreprod"
            />
            <FormTextField
                v-model="formData.codigo_newton"
                label="Código Newton"
                type="number"
                required
                placeholder="Código único del producto"
                :error="errors.codigo_newton"
            />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField
                v-model="formData.h1"
                label="H1"
                required
                placeholder="Título principal del producto"
                :error="errors.h1"
            />
            <FormTextField
                v-model="formData.url"
                label="URL"
                required
                placeholder="/productos/nombre-producto"
                :error="errors.url"
            />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormImageField
                v-model="formData.img"
                label="Imagen Principal"
                :error="errors.img"
            />
            <FormImageField
                v-model="formData.img_mobile"
                label="Imagen Mobile"
                :error="errors.img_mobile"
            />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField
                v-model="formData.video_mapa_mobile"
                label="Video Mapa Mobile"
                placeholder="URL del video para móvil"
                :error="errors.video_mapa_mobile"
            />
            <FormTextField
                v-model="formData.video_mapa_desktop"
                label="Video Mapa Desktop"
                placeholder="URL del video para escritorio"
                :error="errors.video_mapa_desktop"
            />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField
                v-model="formData.podcast"
                label="Podcast"
                placeholder="URL del podcast relacionado"
                :error="errors.podcast"
            />
            <FormTextField
                v-model="formData.cantidad_estrellas"
                label="Cantidad de Estrellas"
                type="number"
                min="1"
                max="5"
                placeholder="Calificación (1-5)"
                :error="errors.cantidad_estrellas"
            />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField
                v-model="formData.cantidadAport"
                label="Cantidad de Aportaciones"
                type="number"
                placeholder="Número de reviews o comentarios"
                :error="errors.cantidadAport"
            />
            <FormTextField
                v-model="formData.consejo_experto"
                label="Consejo del Experto"
                placeholder="Consejo útil para este producto"
                :error="errors.consejo_experto"
            />
        </FormFieldsContainer>

        <FormFieldsContainer>
            <FormTextField
                v-model="formData.precio_total"
                label="Precio Total"
                type="number"
                step="0.01"
                placeholder="0.00"
                :error="errors.precio_total"
            />
            <FormSelectField
                v-model="formData.estado"
                label="Estado"
                required
                :options="estadoOptions"
                placeholder="Seleccionar estado"
                :error="errors.estado"
            />
        </FormFieldsContainer>

        <div class="flex justify-center items-center flex-wrap gap-8 mt-3">
            <ButtonPrimary @click="$emit('cancel')" class="!bg-gray-mid !text-dark">
                Cancelar
            </ButtonPrimary>
            <ButtonPrimary type="submit" :disabled="isSubmitting">
                <span v-if="!isSubmitting">Crear Producto</span>
                <span v-else class="flex items-center gap-2">
                    <Icon name="tabler:loader-2" class="animate-spin" />
                    Creando...
                </span>
            </ButtonPrimary>
        </div>
    </FormLayout>
</template>

<script setup>
const emit = defineEmits(['success', 'cancel'])

const formData = ref({
    nombreprod: '',
    h1: '',
    img: '',
    img_mobile: '',
    video_mapa_mobile: '',
    video_mapa_desktop: '',
    podcast: '',
    codigo_newton: '',
    url: '',
    cantidad_estrellas: 5,
    cantidadAport: 0,
    consejo_experto: '',
    precio_total: 0,
    estado: 'activo'
})

const errors = ref({})
const isSubmitting = ref(false)

// Opciones para selects
const estadoOptions = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'borrador', label: 'Borrador' }
]

const validateForm = () => {
    errors.value = {}
    
    if (!formData.value.nombreprod) errors.value.nombreprod = 'El nombre del producto es requerido'
    if (!formData.value.codigo_newton) errors.value.codigo_newton = 'El código Newton es requerido'
    if (!formData.value.h1) errors.value.h1 = 'El H1 es requerido'
    if (!formData.value.url) errors.value.url = 'La URL es requerida'
    if (!formData.value.estado) errors.value.estado = 'El estado es requerido'
    
    if (formData.value.cantidad_estrellas && (formData.value.cantidad_estrellas < 1 || formData.value.cantidad_estrellas > 5)) {
        errors.value.cantidad_estrellas = 'Las estrellas deben ser entre 1 y 5'
    }
    
    return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
    if (!validateForm()) return
    
    isSubmitting.value = true
    
    try {
        const dataToSubmit = { ...formData.value }
        
        // Generar ID único (en una aplicación real, esto lo haría el backend)
        dataToSubmit.id = Date.now()
        
        // POST
        
        emit('success')
        
    } catch (error) {
        console.error('Error al crear producto:', error)
        // Mostrar error al usuario
    } finally {
        isSubmitting.value = false
    }
}
</script>
