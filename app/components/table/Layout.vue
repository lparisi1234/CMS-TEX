<template>
    <div class="w-full max-w-screen overflow-auto">
        <table class="mx-auto">
            <thead>
                <tr>
                    <th v-for="column in columns" :key="column.key"
                        class="text-center text-dark whitespace-nowrap font-medium p-3">
                        {{ column.label }}
                    </th>
                    <th v-if="showActions" class="text-center text-dark whitespace-nowrap font-medium p-3">
                        Acciones
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(item, index) in data" :key="getRowKey(item, index)" class="h-20 odd:bg-gray-light even:bg-gray-mid border-b border-gray-dark last:border-none">
                    <td v-for="column in columns" :key="column.key" class="border-r border-gray-dark text-dark font-light whitespace-nowrap p-3">
                        <slot :name="`cell-${column.key}`" :item="item" :value="getNestedValue(item, column.key)"
                            :column="column" :index="index">
                            <TableCellRenderer :value="getNestedValue(item, column.key)" :column="column" />
                        </slot>
                    </td>

                    <td v-if="showActions" class="text-dark font-light whitespace-nowrap p-3">
                        <slot name="row-actions" :item="item" :index="index">
                            <div class="flex justify-center items-center gap-2">
                                <button @click="$emit('edit', item, index)"
                                    title="Editar">
                                    <Icon name="tabler:edit" />
                                </button>
                                <button @click="$emit('delete', item, index)"
                                    title="Eliminar">
                                    <Icon name="tabler:trash" />
                                </button>
                            </div>
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="!data || data.length === 0" class="py-12 text-center text-gray-500">
            <slot name="empty">
                <p>{{ emptyStateText }}</p>
            </slot>
        </div>
    </div>
</template>


<script setup>
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    columns: {
        type: Array,
        required: true
    },
    showActions: {
        type: Boolean,
        default: true
    },
    emptyStateText: {
        type: String,
        default: 'No hay datos disponibles'
    },
    rowKey: {
        type: String,
        default: 'id'
    }
})

const emit = defineEmits(['edit', 'delete'])

const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
}

const getRowKey = (item, index) => {
    return getNestedValue(item, props.rowKey) || index
}
</script>