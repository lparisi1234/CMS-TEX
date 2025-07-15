const tablas = {
    configuracion: [
        {
            name: 'Segmentos',
            slug: 'segmentos',
            icon: 'cards',
            endpoint: 'segmentos',
            botonTexto: 'Crear nuevo segmento',
            columns: [
                {
                    key: 'descripcion',
                    label: 'Descripción',
                    type: 'text'
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge'
                },
                {
                    key: 'moneda',
                    label: 'Moneda',
                    type: 'text'
                },
                {
                    key: 'codNewton',
                    label: 'Cód. Newton',
                    type: 'number'
                },
                {
                    key: 'textoHeader',
                    label: 'Texto Header',
                    type: 'text'
                }
            ]
        },
        {
            name: 'Monedas',
            slug: 'monedas',
            icon: 'world-dollar',
            endpoint: 'monedas',
            botonTexto: 'Crear nueva moneda',
            columns: [
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text'
                },
                {
                    key: 'codigo',
                    label: 'Código',
                    type: 'text'
                },
                {
                    key: 'simbolo',
                    label: 'Símbolo',
                    type: 'text'
                },
                {
                    key: 'tasaCambio',
                    label: 'Tasa de Cambio',
                    type: 'currency'
                },
                {
                    key: 'activa',
                    label: 'Activa',
                    type: 'boolean'
                }
            ]
        },
        {
            name: 'Operadores',
            slug: 'operadores',
            icon: 'map-pin',
            endpoint: 'operadores',
            botonTexto: 'Crear nuevo operador',
            columns: [
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text'
                },
                {
                    key: 'pais',
                    label: 'País',
                    type: 'text'
                },
                {
                    key: 'telefono',
                    label: 'Teléfono',
                    type: 'text'
                },
                {
                    key: 'email',
                    label: 'Email',
                    type: 'text'
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge'
                }
            ]
        },
        {
            name: 'Teléfonos',
            slug: 'telefonos',
            icon: 'phone',
            endpoint: 'telefonos',
            botonTexto: 'Crear nuevo teléfono',
            columns: [
                {
                    key: 'numero',
                    label: 'Número',
                    type: 'text'
                },
                {
                    key: 'pais',
                    label: 'País',
                    type: 'text'
                },
                {
                    key: 'tipo',
                    label: 'Tipo',
                    type: 'badge'
                },
                {
                    key: 'activo',
                    label: 'Activo',
                    type: 'boolean'
                }
            ]
        },
        {
            name: 'Número de WhatsApp',
            slug: 'numero-de-whatsapp',
            icon: 'brand-whatsapp',
            endpoint: 'whatsapp-numbers',
            botonTexto: 'Crear nuevo número de WhatsApp',
            columns: [
                {
                    key: 'numero',
                    label: 'Número',
                    type: 'text'
                },
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text'
                },
                {
                    key: 'segmento',
                    label: 'Segmento',
                    type: 'text'
                },
                {
                    key: 'activo',
                    label: 'Activo',
                    type: 'boolean'
                }
            ]
        },
        {
            name: 'Destinos',
            slug: 'destinos',
            icon: 'location',
            endpoint: 'destinos',
            botonTexto: 'Crear nuevo destino',
            columns: [
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text'
                },
                {
                    key: 'pais',
                    label: 'País',
                    type: 'text'
                },
                {
                    key: 'codigo',
                    label: 'Código',
                    type: 'text'
                },
                {
                    key: 'categoria',
                    label: 'Categoría',
                    type: 'badge'
                },
                {
                    key: 'popular',
                    label: 'Popular',
                    type: 'boolean'
                }
            ]
        },
        {
            name: 'Categorías',
            slug: 'categorias',
            icon: 'bookmark',
            endpoint: 'categorias',
            botonTexto: 'Crear nueva categoría',
            columns: [
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text'
                },
                {
                    key: 'descripcion',
                    label: 'Descripción',
                    type: 'text'
                },
                {
                    key: 'color',
                    label: 'Color',
                    type: 'text'
                },
                {
                    key: 'orden',
                    label: 'Orden',
                    type: 'number'
                },
                {
                    key: 'activa',
                    label: 'Activa',
                    type: 'boolean'
                }
            ]
        },
        {
            name: 'Descuentos',
            slug: 'descuentos',
            icon: 'discount',
            endpoint: 'descuentos',
            botonTexto: 'Crear nuevo descuento',
            columns: [
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text'
                },
                {
                    key: 'porcentaje',
                    label: 'Porcentaje',
                    type: 'number'
                },
                {
                    key: 'fechaInicio',
                    label: 'Fecha Inicio',
                    type: 'date'
                },
                {
                    key: 'fechaFin',
                    label: 'Fecha Fin',
                    type: 'date'
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge'
                }
            ]
        },
        {
            name: 'Grupos de oferta',
            slug: 'grupos-de-oferta',
            icon: 'rosette-discount-check',
            endpoint: 'offer-groups',
            botonTexto: 'Crear nuevo grupo de oferta',
            columns: [
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text'
                },
                {
                    key: 'descripcion',
                    label: 'Descripción',
                    type: 'text'
                },
                {
                    key: 'cantidadOfertas',
                    label: 'Ofertas',
                    type: 'number'
                },
                {
                    key: 'fechaCreacion',
                    label: 'Fecha Creación',
                    type: 'date'
                },
                {
                    key: 'activo',
                    label: 'Activo',
                    type: 'boolean'
                }
            ]
        }
    ],
    administracion: [
        {
            name: 'Productos',
            slug: 'productos',
            icon: 'aerial-lift',
            endpoint: 'productos',
            botonTexto: 'Crear nuevo producto',
            columns: [
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text'
                },
                {
                    key: 'precio',
                    label: 'Precio',
                    type: 'currency',
                    currency: 'EUR'
                },
                {
                    key: 'categoria',
                    label: 'Categoría',
                    type: 'text'
                },
                {
                    key: 'fechaCreacion',
                    label: 'Fecha Creación',
                    type: 'date'
                },
                {
                    key: 'activo',
                    label: 'Activo',
                    type: 'boolean'
                }
            ]
        },
        {
            name: 'Notas de Prensa',
            slug: 'notas-de-prensa',
            icon: 'notes',
            endpoint: 'press-notes',
            botonTexto: 'Crear nueva nota de prensa',
            columns: [
                {
                    key: 'titulo',
                    label: 'Título',
                    type: 'text'
                },
                {
                    key: 'autor',
                    label: 'Autor',
                    type: 'text'
                },
                {
                    key: 'fechaPublicacion',
                    label: 'Fecha Publicación',
                    type: 'date'
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge'
                },
                {
                    key: 'destacada',
                    label: 'Destacada',
                    type: 'boolean'
                }
            ]
        },
        {
            name: 'Notas de Blog',
            slug: 'notas-de-blog',
            icon: 'writing',
            endpoint: 'blogs',
            botonTexto: 'Crear nueva nota de blog',
            columns: [
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image'
                },
                {
                    key: 'titulo',
                    label: 'Título',
                    type: 'text'
                },
                {
                    key: 'autor',
                    label: 'Autor',
                    type: 'text'
                },
                {
                    key: 'fecha',
                    label: 'Fecha',
                    type: 'text'
                }
            ]
        }
    ]
}

export default tablas;