import tablas from '~/shared/tablas.js'

export const useDynamicForm = (tablaSlug, itemId = null) => {
    const { success, error } = useNotification()
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

    const getDisplayLabel = (item, tabla, displayField = null) => {
        // Si se especifica un displayField, usarlo
        if (displayField && item[displayField]) {
            return item[displayField]
        }
        
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

    const getRelatedTableData = async (tableName, valueField = 'id', displayField = null) => {
        try {
            const tabla = findTableBySlug(tableName)
            if (!tabla) {
                console.warn(`No se encontró configuración para la tabla: ${tableName}`)
                return []
            }

            const response = await $fetch(`/api/${tabla.endpoint}`)
            const data = response || []

            return data.map(item => ({
                value: String(item[valueField] || item.id),
                label: getDisplayLabel(item, tabla, displayField)
            }))

        } catch (error) {
            console.error(`Error en getRelatedTableData para ${tableName}:`, error)
            return []
        }
    }

    const badgeOptions = [
        { value: 'activo', label: 'Activo' },
        { value: 'inactivo', label: 'Inactivo' },
        { value: 'borrador', label: 'Borrador' },
    ]

    const columnChunks = computed(() => {
        if (!tabla?.columns) return []

        const chunks = []
        let i = 0

        while (i < tabla.columns.length) {
            const column = tabla.columns[i]

            if (column.fullWidth) {
                chunks.push([column])
                i++
            } else {
                const nextColumn = tabla.columns[i + 1]
                if (nextColumn && !nextColumn.fullWidth) {
                    chunks.push([column, nextColumn])
                    i += 2
                } else {
                    chunks.push([column])
                    i++
                }
            }
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
                    case 'checkbox-multiple':
                        formData.value[column.key] = []
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
            if ((column.type === 'select' || column.type === 'checkbox-multiple') && column.relatedTable) {
                loadingOptions.value[column.key] = true

                try {
                    const valueField = column.valueField || 'id'
                    const displayField = column.displayField || null
                    let options = await getRelatedTableData(column.relatedTable, valueField, displayField)

                    // Filtro especial para regiones (destinos sin region_id)
                    if (column.key === 'region_id' && column.relatedTable === 'destinos') {
                        try {
                            const response = await $fetch(`/api/destinos/destinos`)
                            let allDestinos = response || []

                            // Si el endpoint devolvió datos vacíos, usar fallback
                            if (allDestinos.length === 0) {
                                try {
                                    const { default: destinosLocales } = await import('~/shared/destinos/destinos.js')
                                    allDestinos = destinosLocales || []
                                } catch (e) {
                                    console.warn('No se pudo cargar fallback de destinos:', e)
                                }
                            }

                            const regionesOnly = allDestinos.filter(d => !d.region_id)
                            options = regionesOnly.map(item => ({
                                value: String(item.id),
                                label: getDisplayLabel(item, tabla, displayField)
                            }))
                        } catch (err) {
                            console.error('Error cargando regiones:', err)
                            // Fallback: usar datos locales
                            try {
                                const { default: destinosLocales } = await import('~/shared/destinos/destinos.js')
                                const regionesOnly = (destinosLocales || []).filter(d => !d.region_id)
                                options = regionesOnly.map(item => ({
                                    value: String(item.id),
                                    label: getDisplayLabel(item, tabla, displayField)
                                }))
                            } catch (e) {
                                console.error('No se pudo usar fallback:', e)
                                options = []
                            }
                        }
                    }

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

    const filterOptionsByParent = (column, allData) => {
        if (!column.dependsOn) return allData

        const parentValue = formData.value[column.dependsOn]
        if (!parentValue) return []

        // Filtrar datos que tengan el region_id igual al valor seleccionado
        return allData.filter(item => item.region_id == parentValue || item.parent_id == parentValue)
    }

    const loadSelectOptionsForColumn = async (column) => {
        if (!column.relatedTable) return

        loadingOptions.value[column.key] = true

        try {
            const tabla = findTableBySlug(column.relatedTable)
            if (!tabla) {
                console.warn(`No se encontró configuración para la tabla: ${column.relatedTable}`)
                loadingOptions.value[column.key] = false
                return
            }

            let allData = []

            // Intentar con el endpoint
            try {
                const response = await $fetch(`/api/${tabla.endpoint}`)
                allData = response || []
            } catch (err) {
                console.warn(`Error en endpoint ${tabla.endpoint}`)
            }

            // Si el endpoint devolvió datos vacíos, usar fallback
            if (allData.length === 0 && column.relatedTable === 'destinos') {
                try {
                    const { default: destinosLocales } = await import('~/shared/destinos/destinos.js')
                    allData = destinosLocales || []
                } catch (e) {
                    console.error('Error cargando fallback:', e)
                }
            }

            // Si el campo tiene dependencia, filtrar los datos
            const filteredData = filterOptionsByParent(column, allData)

            const options = filteredData.map(item => ({
                value: String(item.id),
                label: getDisplayLabel(item, tabla, column.displayField)
            }))

            selectOptions.value[column.key] = options
        } catch (error) {
            console.error(`Error cargando opciones para ${column.key}:`, error)
            selectOptions.value[column.key] = []
        } finally {
            loadingOptions.value[column.key] = false
        }
    }

    const loadExistingData = async () => {
        if (!itemId || !tabla || !tablaSlug) {
            console.warn('Faltan parámetros para cargar datos existentes:', { itemId, tabla: !!tabla, tablaSlug })
            return null
        }

        loadingData.value = true

        try {
            const allItems = await $fetch(`/api/${tabla.endpoint}`)
            const item = allItems.find(item => item.id == itemId)

            if (item) {
                initializeFormData()

                tabla.columns.forEach(column => {
                    if (item.hasOwnProperty(column.key)) {
                        let value = item[column.key]

                        if (column.type === 'text' || column.type === 'textarea' || column.type === 'currency' || column.type === 'date' || column.type === 'datetime' || column.type === 'image') {
                            formData.value[column.key] = value != null ? String(value) : ''
                        } else if (column.type === 'badge') {
                            formData.value[column.key] = value != null ? String(value).toLowerCase() : ''
                        } else if (column.type === 'checkbox-multiple') {
                            if (typeof value === 'string' && value) {
                                formData.value[column.key] = value.split(',').map(v => String(v.trim())).filter(Boolean)
                            } else if (Array.isArray(value)) {
                                formData.value[column.key] = value.map(v => String(v)).filter(v => v !== 'null' && v !== 'undefined' && v !== '')
                            } else {
                                formData.value[column.key] = []
                            }
                        } else if (column.type === 'select') {
                            formData.value[column.key] = value != null ? String(value) : ''
                        } else if (column.type === 'array') {
                            if (Array.isArray(value)) {
                                formData.value[column.key] = value
                            } else {
                                formData.value[column.key] = []
                            }
                        } else {
                            formData.value[column.key] = value
                        }
                    }
                })

                formData.value.id = item.id

                return item
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
            } else if (column.type === 'image') {
                dataToSubmit[column.key] = value || ''
            }
        })

        return dataToSubmit
    }

    const createItem = async () => {
        if (!validateForm()) return false

        isSubmitting.value = true

        try {
            const dataToSubmit = prepareDataForSubmit()
            const endpointBase = tabla.endpoint.split('/')[0]
            
            const result = await $fetch(`/api/${endpointBase}/create`, {
                method: 'PUT',
                body: dataToSubmit
            })

            success(`${tabla.name} creado exitosamente`)
            return result
        } catch (err) {
            console.error('Error al crear:', err)
            error(`Error al crear ${tabla.name}`)
            return { success: false }
        } finally {
            isSubmitting.value = false
        }
    }

    const updateItem = async () => {
        if (!validateForm()) return false

        isSubmitting.value = true

        try {
            const dataToSubmit = prepareDataForSubmit()
            const endpointBase = tabla.endpoint.split('/')[0]

            await $fetch(`/api/${endpointBase}/update`, {
                method: 'PUT',
                body: { ...dataToSubmit, id: itemId }
            })

            success(`${tabla.name} actualizado exitosamente`)
            return true
        } catch (err) {
            console.error('Error al actualizar:', err)
            error(`Error al actualizar ${tabla.name}`)
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    // Watchers para campos dependientes
    const setupDependentFieldWatchers = () => {
        if (!tabla?.columns) return

        tabla.columns.forEach(column => {
            if (column.dependsOn) {
                watch(
                    () => formData.value[column.dependsOn],
                    async (newValue) => {
                        if (newValue) {
                            // Limpiar selección anterior cuando cambia el padre
                            formData.value[column.key] = []
                            // Recargar opciones filtradas
                            await loadSelectOptionsForColumn(column)
                        } else {
                            selectOptions.value[column.key] = []
                        }
                    }
                )
            }
        })
    }

    // Usar onMounted para configurar los watchers después de cargar las opciones
    onMounted(() => {
        setupDependentFieldWatchers()
    })

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
        loadSelectOptionsForColumn,
        loadExistingData,
        validateForm,
        prepareDataForSubmit,
        createItem,
        updateItem,
        findTableBySlug
    }
}