<template>
    <div>
        <button @click="toggleMenu"
            class="flex justify-center items-center absolute top-1/2 left-6 lg:left-24 -translate-y-1/2 z-50"
            :class="{ 'hidden': isMenuOpen }">
            <Icon name="tabler:menu-2" class="w-7 h-7 text-light" />
        </button>

        <Teleport to="body">
            <Transition enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 -translate-x-full" enter-to-class="opacity-100 translate-x-0"
                leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-x-0"
                leave-to-class="opacity-0 -translate-x-full">
                <div v-if="isMenuOpen" class="h-full flex fixed inset-0 z-40" @click="closeMenu">
                    <nav class="w-full max-w-[17.25rem] h-full relative flex flex-col justify-between bg-secondary shadow-menu p-3 pt-6"
                        @click.stop>
                        <div class="flex flex-col gap-4">
                            <div class="flex items-center justify-between pl-3">
                                <p class="text-xl font-medium text-light">Tour Experto</p>
                                <button @click="closeMenu" class="flex justify-center items-center">
                                    <Icon name="tabler:x" class="w-7 h-7 text-light" />
                                </button>
                            </div>

                            <div class="flex flex-col gap-2">
                                <p class="text-xs font-medium text-terciary uppercase pl-3">
                                    Configuración
                                </p>
                                <ul>
                                    <li v-for="item in menuConfiguracion" :key="item.name">
                                        <NuxtLink to="#"
                                            class="flex items-center gap-3 text-light font-light py-[0.625rem] px-3"
                                            @click="closeMenu">
                                            <Icon :name="`tabler:${item.icon}`" class="w-5 h-5" />
                                            <span>{{ item.name }}</span>
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </div>

                            <div class="flex flex-col gap-2">
                                <p class="text-xs font-medium text-terciary uppercase pl-3">
                                    Administración
                                </p>
                                <ul>
                                    <li v-for="item in menuAdministracion" :key="item.name">
                                        <NuxtLink to="#"
                                            class="flex items-center gap-3 text-light font-light py-[0.625rem] px-3"
                                            @click="closeMenu">
                                            <Icon :name="`tabler:${item.icon}`" class="w-5 h-5" />
                                            <span>{{ item.name }}</span>
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <button @click="logout"
                            class="flex items-center gap-3 text-light font-light py-[0.625rem] px-3">
                            <Icon name="tabler:logout" class="w-5 h-5" />
                            <span>Cerrar sesión</span>
                        </button>
                    </nav>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

const router = useRouter()

const isMenuOpen = ref(false)

const menuConfiguracion = [
    {
        name: 'Segmentos',
        icon: 'cards'
    },
    {
        name: 'Monedas',
        icon: 'world-dollar'
    },
    {
        name: 'Operadores',
        icon: 'map-pin'
    },
    {
        name: 'Teléfonos',
        icon: 'phone'
    },
    {
        name: 'Número de WhatsApp',
        icon: 'brand-whatsapp'
    },
    {
        name: 'Destinos',
        icon: 'location'
    },
    {
        name: 'Categorías',
        icon: 'bookmark'
    },
    {
        name: 'Descuentos',
        icon: 'discount'
    },
    {
        name: 'Grupos de Oferta',
        icon: 'rosette-discount-check'
    }
]

const menuAdministracion = [
    {
        name: 'Productos',
        icon: 'aerial-lift'
    },
    {
        name: 'Notas de Prensa',
        icon: 'notes'
    },
    {
        name: 'Notas de Blog',
        icon: 'writing'
    }
]

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
    isMenuOpen.value = false
}

const logout = async () => {
    // Logica logout
    closeMenu()

    await router.push(ROUTE_NAMES.LOGIN)
}

watch(() => router.currentRoute.value.path, () => {
    closeMenu()
})

onMounted(() => {
    const handleEscape = (e) => {
        if (e.key === 'Escape' && isMenuOpen.value) {
            closeMenu()
        }
    }

    document.addEventListener('keydown', handleEscape)

    onUnmounted(() => {
        document.removeEventListener('keydown', handleEscape)
    })
})
</script>