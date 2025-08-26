<template>
    <DefaultSection>
        <HeadingH1>Iniciar sesión</HeadingH1>

        <FormContainer class="gap-4 lg:gap-7">
            <FormFieldsContainer>
                <FormTextField v-model="formData.email" label="Correo electrónico" id="correo-electronico" type="email"
                    placeholder="stevejobs" autocomplete="username" :error="errors.email" required
                    @blur="validateEmail" />

                <FormPasswordField v-model="formData.password" label="Contraseña" id="contrasena"
                    placeholder="Ingresa tu contraseña" :error="errors.password" required @blur="validatePassword" />
            </FormFieldsContainer>

            <NuxtLink to="#" class="text-dark font-light underline">
                ¿Olvidaste tu contraseña?
            </NuxtLink>

            <ButtonPrimary class="lg:!px-48" :disabled="isLoading" @click="handleSubmit">
                <span v-if="!isLoading">Ingresar</span>
                <span v-else class="flex items-center gap-2">
                    <Icon name="tabler:loader-2" class="animate-spin" />
                    Iniciando sesión...
                </span>
            </ButtonPrimary>
        </FormContainer>
    </DefaultSection>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES.js'

definePageMeta({
    layout: "auth",
});

const router = useRouter()

const formData = reactive({
    email: '',
    password: ''
})

const errors = reactive({
    email: '',
    password: ''
})

const isLoading = ref(false)

const isFormValid = computed(() => {
    return formData.email.length > 0 &&
        formData.password.length > 0 &&
        !errors.email &&
        !errors.password
})

const validateEmail = () => {
    if (!formData.email) {
        errors.email = 'El correo electrónico es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Formato de correo electrónico inválido'
    } else {
        errors.email = ''
    }
}

const validatePassword = () => {
    if (!formData.password) {
        errors.password = 'La contraseña es requerida'
    } else {
        errors.password = ''
    }
}

watch(() => formData.email, () => {
    if (errors.email) errors.email = ''
})

watch(() => formData.password, () => {
    if (errors.password) errors.password = ''
})

const handleSubmit = async () => {
    isLoading.value = true

    validateEmail()
    validatePassword()

    if (errors.email || errors.password) {
        isLoading.value = false
        return
    }

    try {
        const response = await $fetch('/api/login', {
            method: 'POST',
            body: {
                email: formData.email,
                password: formData.password
            }
        })

        if (response.status === 'SUCCESS') {
            await router.push(ROUTE_NAMES.HOME)
        }

    } catch (error) {
        console.error('Error en login:', error)
        if (error.statusCode === 401) {
            errors.password = 'Credenciales incorrectas'
        } else {
            errors.password = 'Error al iniciar sesión. Intenta nuevamente.'
        }
    } finally {
        isLoading.value = false
    }
}

const handleEnterKey = () => {
    if (!isLoading.value) {
        handleSubmit()
    }
}
</script>