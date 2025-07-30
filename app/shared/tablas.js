const tablas = {
    configuracion: [
        {
            name: 'Segmentos',
            slug: 'segmentos',
            icon: 'cards',
            endpoint: 'segmentos/segmentos',
            botonTexto: 'Crear nuevo segmento',
            columns: [
                {
                    key: 'descripcion',
                    label: 'Descripción',
                    type: 'text',
                    required: true
                },
                {
                    key: 'codigo_newton',
                    label: 'Código Newton',
                    type: 'number',
                    required: true
                },
                {
                    key: 'txt_header',
                    label: 'Texto Header',
                    type: 'text'
                },
                {
                    key: 'vencimiento_header',
                    label: 'Vencimiento Header',
                    type: 'date'
                },
                {
                    key: 'txt_footer',
                    label: 'Texto Footer',
                    type: 'text',
                    required: true
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge',
                    required: true
                },
                {
                    key: 'monedaId',
                    label: 'Moneda',
                    type: 'select',
                    relatedTable: 'monedas',
                    required: true
                }
            ]
        },
        {
            name: 'Monedas',
            slug: 'monedas',
            icon: 'world-dollar',
            endpoint: 'monedas/monedas',
            botonTexto: 'Crear nueva moneda',
            columns: [
                {
                    key: 'descripcion',
                    label: 'Descripción',
                    type: 'text',
                    required: true
                },
                {
                    key: 'codigo',
                    label: 'Código',
                    type: 'text',
                    required: true
                },
                {
                    key: 'importe',
                    label: 'Importe',
                    type: 'currency',
                    required: true
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge',
                    required: true
                }
            ]
        },
        {
            name: 'Operadores',
            slug: 'operadores',
            icon: 'map-pin',
            endpoint: 'operadores/operadores',
            botonTexto: 'Crear nuevo operador',
            columns: [
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text',
                    required: true
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge',
                    required: true
                },
                {
                    key: 'certificado',
                    label: 'Certificado',
                    type: 'file',
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                    required: true
                },
                {
                    key: 'codigo',
                    label: 'Código',
                    type: 'text',
                    required: true
                },
                {
                    key: 'nro_orden',
                    label: 'Número de Orden',
                    type: 'number'
                },
                {
                    key: 'txt_contacto',
                    label: 'Texto Contacto',
                    type: 'textarea',
                    required: true
                },
                {
                    key: 'txt_cancelaciones',
                    label: 'Texto Cancelaciones',
                    type: 'textarea',
                    required: true
                }
            ]
        },
        {
            name: 'Número de WhatsApp',
            slug: 'whatsapp',
            icon: 'brand-whatsapp',
            endpoint: 'whatsapp',
            botonTexto: 'Editar número de WhatsApp',
            isSpecialPage: true,
            columns: [
                {
                    key: 'whatsapp',
                    label: 'Whatsapp',
                    type: 'text'
                },
            ]
        },
        {
            name: 'Países Operativos',
            slug: 'paises-operativos',
            icon: 'flag',
            endpoint: 'paises-operativos/paises-operativos',
            botonTexto: 'Crear nuevo país operativo',
            columns: [
                {
                    key: 'numero',
                    label: 'Número',
                    type: 'text'
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image'
                },
                {
                    key: 'pais_apertura',
                    label: 'País Apertura',
                    type: 'text',
                },
                {
                    key: 'segmento',
                    label: 'Segmento',
                    type: 'select',
                    relatedTable: 'segmentos'
                },
            ]
        },
        {
            name: 'Destinos',
            slug: 'destinos',
            icon: 'location',
            endpoint: 'destinos/destinos',
            botonTexto: 'Crear nuevo destino',
            columns: [
                {
                    key: 'codigo_newton',
                    label: 'Código Newton',
                    type: 'number',
                    required: true
                },
                {
                    key: 'url',
                    label: 'URL',
                    type: 'text'
                },
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text',
                    required: true
                },
                {
                    key: 'h1',
                    label: 'H1',
                    type: 'text'
                },
                {
                    key: 'h2',
                    label: 'H2',
                    type: 'text'
                },
                {
                    key: 'meta_titulo',
                    label: 'Meta Título',
                    type: 'text'
                },
                {
                    key: 'meta_descripcion',
                    label: 'Meta Descripción',
                    type: 'text'
                },
                {
                    key: 'meta_keywords',
                    label: 'Meta Keywords',
                    type: 'text'
                },
                {
                    key: 'video_mobile',
                    label: 'Video Mobile',
                    type: 'image'
                },
                {
                    key: 'video_desktop',
                    label: 'Video Desktop',
                    type: 'image'
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image'
                },

                {
                    key: 'mapa',
                    label: 'Coordenadas',
                    type: 'text'
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge',
                    required: true
                },
                {
                    key: 'nro_orden',
                    label: 'Número de Orden',
                    type: 'number'
                },
                {
                    key: 'desde_precio',
                    label: 'Precio Desde',
                    type: 'currency'
                },
                {
                    key: 'regionId',
                    label: 'Región',
                    type: 'select',
                    relatedTable: 'destinos'
                },
                {
                    key: 'experto_id',
                    label: 'Experto',
                    type: 'select',
                    relatedTable: 'expertos',
                    displayField: 'nombre'
                },
                {
                    key: 'consejo_experto',
                    label: 'Consejo Experto',
                    type: 'textarea'
                },
            ]
        },
        {
            name: 'Categorías',
            slug: 'categorias',
            icon: 'bookmark',
            endpoint: 'categorias/categorias',
            botonTexto: 'Crear nueva categoría',
            columns: [
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text',
                    required: true
                },
                {
                    key: 'url',
                    label: 'URL',
                    type: 'text',
                    required: true
                },
                {
                    key: 'h1',
                    label: 'H1',
                    type: 'text',
                    required: true
                },
                {
                    key: 'h2',
                    label: 'H2',
                    type: 'text',
                    required: true
                },
                {
                    key: 'meta_titulo',
                    label: 'Meta Título',
                    type: 'text',
                    required: true
                },
                {
                    key: 'meta_descripcion',
                    label: 'Meta Descripción',
                    type: 'text',
                    required: true
                },
                {
                    key: 'meta_keywords',
                    label: 'Meta Keywords',
                    type: 'text',
                    required: true
                },
                {
                    key: 'icono',
                    label: 'Ícono',
                    type: 'image',
                    required: true
                },
                {
                    key: 'coordenadas_icono',
                    label: 'Coordenadas Ícono',
                    type: 'text',
                    required: true
                },
                {
                    key: 'coordenadas_icono_hover',
                    label: 'Coordenadas Ícono Hover',
                    type: 'text',
                    required: true
                },
                {
                    key: 'img_carousel',
                    label: 'Imagen Carousel',
                    type: 'image',
                    required: true
                },
                {
                    key: 'img_search',
                    label: 'Imagen Search',
                    type: 'image',
                    required: true
                },
                {
                    key: 'video_mobile',
                    label: 'Video Mobile',
                    type: 'image',
                    required: true
                },
                {
                    key: 'video_desktop',
                    label: 'Video Desktop',
                    type: 'image',
                    required: true
                },
                {
                    key: 'nro_orden',
                    label: 'Número de Orden',
                    type: 'number',
                    required: true
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge',
                    required: true
                },
                {
                    key: 'codigo_newton',
                    label: 'Código Newton',
                    type: 'number',
                    required: true
                },
                {
                    key: 'idExperto',
                    label: 'Experto',
                    type: 'select',
                    relatedTable: 'expertos',
                    displayField: 'nombre',
                    required: true
                },
                {
                    key: 'consejo_experto',
                    label: 'Consejo Experto',
                    type: 'textarea',
                    required: true
                },
                {
                    key: 'icono_search',
                    label: 'Icono Search',
                    type: 'image'
                },
                {
                    key: 'etiqueta_search',
                    label: 'Etiqueta Search',
                    type: 'text',
                },
                {
                    key: 'subgrupos',
                    label: 'Subgrupos',
                    type: 'array',
                },
            ]
        },
        {
            name: 'Descuentos',
            slug: 'descuentos',
            icon: 'discount',
            endpoint: 'descuentos/descuentos',
            botonTexto: 'Crear nuevo descuento',
            columns: [
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text',
                    required: true
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                    required: true
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge',
                    required: true
                },
                {
                    key: 'codigo_newton',
                    label: 'Código Newton',
                    type: 'number',
                    required: true
                }
            ]
        },
    ],
    administracion: [
        {
            name: 'Productos',
            slug: 'productos',
            icon: 'aerial-lift',
            endpoint: 'productos/productos',
            botonTexto: 'Crear nuevo producto',
            columns: [
                {
                    key: 'nombreprod',
                    label: 'Nombre Producto',
                    type: 'text',
                    required: true
                },
                {
                    key: 'h1',
                    label: 'H1',
                    type: 'text'
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image'
                },
                {
                    key: 'img_mobile',
                    label: 'Imagen Mobile',
                    type: 'image'
                },
                {
                    key: 'video_mapa_mobile',
                    label: 'Video Mapa Mobile',
                    type: 'text'
                },
                {
                    key: 'video_mapa_desktop',
                    label: 'Video Mapa Desktop',
                    type: 'text'
                },
                {
                    key: 'podcast',
                    label: 'Podcast',
                    type: 'text'
                },
                {
                    key: 'codigo_newton',
                    label: 'Código Newton',
                    type: 'number',
                    required: true
                },
                {
                    key: 'url',
                    label: 'URL',
                    type: 'text'
                },
                {
                    key: 'cantidad_estrellas',
                    label: 'Cantidad Estrellas',
                    type: 'number'
                },
                {
                    key: 'cantidadAport',
                    label: 'Cantidad Aportaciones',
                    type: 'number'
                },
                {
                    key: 'consejo_experto',
                    label: 'Consejo Experto',
                    type: 'textarea'
                },
                {
                    key: 'expertoId',
                    label: 'Experto',
                    type: 'select',
                    relatedTable: 'expertos',
                    displayField: 'nombre'
                },
                {
                    key: 'meta_titulo',
                    label: 'Meta Título',
                    type: 'text'
                },
                {
                    key: 'meta_descripcion',
                    label: 'Meta Descripción',
                    type: 'text'
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge',
                    required: true
                }
            ]
        },
        {
            name: 'Grupos de Oferta',
            slug: 'grupos-de-oferta',
            icon: 'rosette-discount-check',
            endpoint: 'grupos-de-oferta/grupos-de-oferta',
            botonTexto: 'Crear nuevo grupo de oferta',
            columns: [
                {
                    key: 'descripcion',
                    label: 'Descripción',
                        type: 'text',
                        required: true
                },
                {
                    key: 'segundaDescripcion',
                    label: 'Segunda Descripción',
                    type: 'text',
                    required: true
                },
                {
                    key: 'titulo',
                    label: 'Título para landing',
                    type: 'text',
                    required: true
                },
                {
                    key: 'subtitulo',
                    label: 'Subtítulo para landing',
                    type: 'textarea',
                    required: true
                },
                {
                    key: 'descuento_id',
                    label: 'Sticker Descuento',
                    type: 'select',
                    relatedTable: 'descuentos',
                    required: true
                },
                {
                    key: 'img_desktop',
                    label: 'Imagen Desktop',
                    type: 'image',
                    required: true
                },
                {
                    key: 'img_tablet',
                    label: 'Imagen Tablet',
                    type: 'image',
                    required: true
                },
                {
                    key: 'img_mobile',
                    label: 'Imagen Mobile',
                    type: 'image',
                    required: true
                },
                {
                    key: 'nro_orden',
                    label: 'Número de Orden',
                    type: 'number',
                    required: true
                },
                {
                    key: 'url',
                    label: 'URL',
                    type: 'text',
                    required: true
                },
                {
                    key: 'hasta_fecha',
                    label: 'Hasta Fecha',
                    type: 'date',
                    required: true
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge',
                    required: true
                },
                {
                    key: 'segmentosExcluidos',
                    label: 'Segmentos Excluidos',
                    type: 'checkbox-multiple',
                    relatedTable: 'segmentos',
                }
            ]
        },
        {
            name: 'Qué esperar Categorías',
            slug: 'que-esperar-categorias',
            icon: 'star',
            endpoint: 'que-esperar-categorias/que-esperar-categorias',
            botonTexto: 'Crear nuevo Que Esperar',
            columns: [
                {
                    key: 'titulo',
                    label: 'Título',
                    type: 'text',
                    required: true
                },
                {
                    key: 'texto',
                    label: 'Texto',
                    type: 'text',
                    required: true
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                    required: true
                },
                {
                    key: 'nro_orden',
                    label: 'Número de Orden',
                    type: 'number',
                    required: true
                },
                {
                    key: 'categoriaId',
                    label: 'Categoría',
                    type: 'select',
                    relatedTable: 'categorias',
                    required: true
                }
            ]
        },
        {
            name: 'Destinos destacados Home',
            slug: 'destinos-destacados-home',
            icon: 'world-star',
            endpoint: 'destinos-destacados-home/destinos-destacados-home',
            botonTexto: 'Crear nuevo Destino Destacado Home',
            columns: [
                {
                    key: 'destino_id',
                    label: 'Destino',
                    type: 'select',
                    relatedTable: 'destinos',
                    required: true
                },
                {
                    key: 'imagen',
                    label: 'Imagen',
                    type: 'image',
                    required: true
                },
                {
                    key: 'segmentos_excluidos',
                    label: 'Segmentos Excluidos',
                    type: 'checkbox-multiple',
                    relatedTable: 'segmentos',
                },
                {
                    key: 'nro_orden',
                    label: 'Número de Orden',
                    type: 'number',
                    required: true
                },
                {
                    key: 'precio_desde',
                    label: 'Precio Desde',
                    type: 'currency',
                    required: true
                }
            ]
        },
        {
            name: 'Opiniones',
            slug: 'opiniones',
            icon: 'message-chatbot',
            endpoint: 'opiniones/opiniones',
            botonTexto: 'Crear nueva Opinión',
            columns: [
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text',
                    required: true
                },
                {
                    key: 'tour',
                    label: 'Tour',
                    type: 'text',
                    required: true
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                    required: true
                },
                {
                    key: 'rating',
                    label: 'Rating',
                    type: 'number',
                    required: true
                },
                {
                    key: 'comentario',
                    label: 'Comentario',
                    type: 'text',
                    required: true
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge',
                    required: true
                },
                {
                    key: 'destacado',
                    label: 'Destacado',
                    type: 'boolean',
                    required: true
                },
                {
                    key: 'producto_Id',
                    label: 'Producto',
                    type: 'select',
                    relatedTable: 'productos',
                    required: true
                },
                {
                    key: 'categoria_id',
                    label: 'Categoría',
                    type: 'select',
                    relatedTable: 'categorias',
                    required: true
                },
                {
                    key: 'destino_id',
                    label: 'Destino',
                    type: 'select',
                    relatedTable: 'destinos',
                    required: true
                }
            ]
        },
        {
            name: 'Preguntas Frecuentes',
            slug: 'preguntas-frecuentes',
            icon: 'zoom-question',
            endpoint: 'preguntas-frecuentes/preguntas-frecuentes',
            botonTexto: 'Crear nueva Pregunta Frecuente',
            columns: [
                {
                    key: 'pregunta',
                    label: 'Pregunta',
                    type: 'text',
                    required: true
                },
                {
                    key: 'respuesta',
                    label: 'Respuesta',
                    type: 'text',
                    required: true
                },
                {
                    key: 'destino_id',
                    label: 'Destino',
                    type: 'select',
                    relatedTable: 'destinos',
                    required: true
                }
            ]
        },
        {
            name: 'Notas de Prensa',
            slug: 'notas-de-prensa',
            icon: 'notes',
            endpoint: 'notas-de-prensa/notas-de-prensa',
            botonTexto: 'Crear nueva nota de prensa',
            columns: [
                {
                    key: 'descripcion',
                    label: 'Descripción',
                    type: 'text'
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image'
                },
                {
                    key: 'url',
                    label: 'URL',
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
            name: 'Notas de Blog',
            slug: 'notas-de-blog',
            icon: 'writing',
            endpoint: 'blogs/blogs',
            botonTexto: 'Crear nueva nota de blog',
            columns: [
                {
                    key: 'titulo',
                    label: 'Título',
                    type: 'text',
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                },
                {
                    key: 'autor',
                    label: 'Autor',
                    type: 'text',
                },
                {
                    key: 'fecha',
                    label: 'Fecha',
                    type: 'date',
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge',
                },
                {
                    key: 'destacado_home',
                    label: 'Destacado Home',
                    type: 'boolean'
                },
                {
                    key: 'destino_id',
                    label: 'Destino',
                    type: 'select',
                    relatedTable: 'destinos'
                },
                {
                    key: 'categoria_id',
                    label: 'Categoría',
                    type: 'select',
                    relatedTable: 'categorias'
                },
            ]
        },
        {
            name: 'Expertos',
            slug: 'expertos',
            icon: 'users-group',
            endpoint: 'expertos/expertos',
            botonTexto: 'Crear nuevo experto',
            columns: [
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                    required: true
                },
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text',
                    required: true
                }
            ]
        },
        {
            name: 'Ciudades',
            slug: 'ciudades',
            icon: 'building',
            endpoint: 'ciudades/ciudades',
            botonTexto: 'Crear nueva ciudad',
            showInNav: false,
            columns: [
                {
                    key: 'codigo_newton',
                    label: 'Código Newton',
                    type: 'number',
                    required: true
                },
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text',
                    required: true
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge',
                    required: true
                },
                {
                    key: 'paises_id',
                    label: 'País',
                    type: 'select',
                    relatedTable: 'destinos',
                    required: true
                },
                {
                    key: 'guia',
                    label: 'Guía',
                    type: 'file',
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                },
            ]
        }
    ]
}

export default tablas;