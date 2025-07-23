import tablas from '~/shared/tablas.js'

export const useDynamicForm = (tablaSlug, itemId = null) => {
    const formData = ref({})
    const errors = ref({})
    const selectOptions = ref({})
    const loadingOptions = ref({})
    const isSubmitting = ref(false)
    const loadingData = ref(false)

    const findTableBySlug = (slug) => {
        if (!slug) return null

        let tabla = tablas.configuracion.find(item => item.slug === slug)
        if (tabla) return tabla

        tabla = tablas.administracion.find(item => item.slug === slug)
        if (tabla) return tabla

        return null
    }

    const tabla = findTableBySlug(tablaSlug)

    const getDisplayLabel = (item, tabla) => {
        if (item.nombre) return item.nombre
        if (item.descripcion) return item.descripcion
        if (item.titulo) return item.titulo
        if (item.label) return item.label
        if (item.h1) return item.h1
        if (item.nombreprod) return item.nombreprod

        const textColumn = tabla.columns.find(col => col.type === 'text')
        if (textColumn && item[textColumn.key]) {
            return item[textColumn.key]
        }

        return `Item ${item.id}`
    }

    const getRelatedTableData = async (tableName) => {
        try {
            const tabla = findTableBySlug(tableName)
            if (!tabla) {
                console.warn(`No se encontró configuración para la tabla: ${tableName}`)
                return []
            }

            const modules = import.meta.glob('~/shared/**/*.js', { eager: false })
            let modulePath = `/shared/${tabla.endpoint}.js`
            
            let moduleImporter = modules[modulePath]
            if (!moduleImporter) {
                modulePath = `/shared/${tableName}/${tableName}.js`
                moduleImporter = modules[modulePath]
            }

            if (moduleImporter) {
                const module = await moduleImporter()
                const data = module.default || []

                return data.map(item => ({
                    value: item.id,
                    label: getDisplayLabel(item, tabla)
                }))
            }

            console.warn(`No se encontró archivo de datos para: ${tableName}`)
            return []

        } catch (error) {
            console.error(`Error en getRelatedTableData para ${tableName}:`, error)
            return []
        }
    }

    const badgeOptions = [
        { value: 'activo', label: 'Activo' },
        { value: 'inactivo', label: 'Inactivo' },
        { value: 'borrador', label: 'Borrador' },
        { value: 'publicado', label: 'Publicado' },
        { value: 'archivado', label: 'Archivado' }
    ]

    const columnChunks = computed(() => {
        if (!tabla?.columns) return []

        const chunks = []
        for (let i = 0; i < tabla.columns.length; i += 2) {
            chunks.push(tabla.columns.slice(i, i + 2))
        }
        return chunks
    })

    const initializeFormData = (existingData = null) => {
        if (!tabla?.columns) return

        tabla.columns.forEach(column => {
            if (existingData && existingData[column.key] !== undefined) {
                formData.value[column.key] = existingData[column.key]
            } else {
                switch (column.type) {
                    case 'boolean':
                        formData.value[column.key] = false
                        break
                    case 'number':
                    case 'currency':
                        formData.value[column.key] = ''
                        break
                    default:
                        formData.value[column.key] = ''
                }
            }

            errors.value[column.key] = ''
        })
    }

    const loadSelectOptions = async () => {
        if (!tabla?.columns) return

        for (const column of tabla.columns) {
            if (column.type === 'select' && column.relatedTable) {
                loadingOptions.value[column.key] = true

                try {
                    const options = await getRelatedTableData(column.relatedTable)
                    selectOptions.value[column.key] = options
                } catch (error) {
                    console.error(`Error cargando opciones para ${column.key}:`, error)
                    selectOptions.value[column.key] = []
                } finally {
                    loadingOptions.value[column.key] = false
                }
            }
        }
    }

    const loadExistingData = async () => {
        if (!itemId || !tabla || !tablaSlug) {
            console.warn('Faltan parámetros para cargar datos existentes:', { itemId, tabla: !!tabla, tablaSlug })
            return null
        }

        loadingData.value = true

        try {
            const modules = import.meta.glob('~/shared/**/*.js', { eager: false })
            const modulePath = `/shared/${tabla.endpoint}.js`

            const moduleImporter = modules[modulePath]
            if (moduleImporter) {
                const module = await moduleImporter()
                const data = module.default || []

                const item = data.find(item => item.id == itemId)
                if (item) {
                    initializeFormData()

                    tabla.columns.forEach(column => {
                        if (item.hasOwnProperty(column.key)) {
                            let value = item[column.key]
                            
                            if (column.type === 'text' || column.type === 'currency' || column.type === 'date' || column.type === 'datetime') {
                                formData.value[column.key] = value != null ? String(value) : ''
                            } else if (column.type === 'badge') {
                                formData.value[column.key] = value != null ? String(value).toLowerCase() : ''
                            } else {
                                formData.value[column.key] = value
                            }
                        }
                    })

                    return item
                }
            }

            console.error(`No se encontró elemento con ID ${itemId} en la tabla ${tablaSlug}`)
            return null

        } catch (error) {
            console.error('Error cargando datos existentes:', error)
            return null
        } finally {
            loadingData.value = false
        }
    }

    const validateForm = () => {
        if (!tabla?.columns) return false

        let isValid = true
        const newErrors = {}

        tabla.columns.forEach(column => {
            if (column.required) {
                const value = formData.value[column.key]

                if (column.type === 'boolean') {
                    newErrors[column.key] = ''
                } else if (!value || (typeof value === 'string' && value.trim() === '')) {
                    newErrors[column.key] = `${column.label} es requerido`
                    isValid = false
                } else {
                    newErrors[column.key] = ''
                }
            } else {
                newErrors[column.key] = ''
            }
        })

        errors.value = newErrors
        return isValid
    }

    const prepareDataForSubmit = () => {
        const dataToSubmit = { ...formData.value }

        tabla.columns.forEach(column => {
            const value = dataToSubmit[column.key]

            if (column.type === 'number' || column.type === 'currency') {
                dataToSubmit[column.key] = value ? Number(value) : null
            }
        })

        return dataToSubmit
    }

    return {
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
        loadExistingData,
        validateForm,
        prepareDataForSubmit,
        findTableBySlug
    }
}