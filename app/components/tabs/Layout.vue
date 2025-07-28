<template>
    <div class="w-full">
        <div class="flex gap-2 border-b border-violet">
            <button v-for="tab in tabs" :key="tab.id"
                type="button"
                class="border border-b-0 border-secondary rounded-t-xl font-medium uppercase transition-colors duration-200 py-2 px-5"
                :class="[
                    activeTab === tab.id
                        ? 'bg-violet text-light'
                        : 'text-violet'
                ]" 
                @click.prevent="setActiveTab(tab.id)">
                {{ tab.label }}
            </button>
        </div>

        <div class="mt-8">
            <slot :name="activeTab" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    tabs: {
        type: Array,
        required: true
    },
    defaultTab: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['tab-change'])

const activeTab = ref(props.defaultTab || props.tabs[0]?.id)

const setActiveTab = (tabId) => {
    activeTab.value = tabId
    emit('tab-change', tabId)
}

watch(() => props.tabs, (newTabs) => {
    if (!newTabs.find(tab => tab.id === activeTab.value)) {
        activeTab.value = newTabs[0]?.id
    }
}, { immediate: true })
</script>
