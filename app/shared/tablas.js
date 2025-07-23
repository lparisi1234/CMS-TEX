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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
                {
                    key: 'descripcion',
                    label: 'Descripción',
                    type: 'text'
                },
                {
                    key: 'codigo',
                    label: 'Código',
                    type: 'text'
                },
                {
                    key: 'txt_header',
                    label: 'Texto Header',
                    type: 'text'
                },
                {
                    key: 'vencimiento_header',
                    label: 'Vencimiento Header',
                    type: 'text'
                },
                {
                    key: 'txt_footer',
                    label: 'Texto Footer',
                    type: 'text'
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge'
                },
                {
                    key: 'codigo_newton',
                    label: 'Código Newton',
                    type: 'number'
                },
                {
                    key: 'monedaId',
                    label: 'Moneda',
                    type: 'select',
                    relatedTable: 'monedas'
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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
                {
                    key: 'descripcion',
                    label: 'Descripción',
                    type: 'text'
                },
                {
                    key: 'codigo',
                    label: 'Código',
                    type: 'text'
                },
                {
                    key: 'importe',
                    label: 'Importe',
                    type: 'currency'
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge'
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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
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
                    key: 'certificado',
                    label: 'Certificado',
                    type: 'text'
                },
                {
                    key: 'codigo',
                    label: 'Código',
                    type: 'text'
                },
                {
                    key: 'nro_orden',
                    label: 'Número de Orden',
                    type: 'number'
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image'
                },
                {
                    key: 'txt_contacto',
                    label: 'Texto Contacto',
                    type: 'text'
                },
                {
                    key: 'txt_cancelaciones',
                    label: 'Texto Cancelaciones',
                    type: 'text'
                }
            ]
        },
        {
            name: 'Número de WhatsApp',
            slug: 'whatsapp',
            icon: 'brand-whatsapp',
            endpoint: 'whatsapp',
            botonTexto: 'Editar número de WhatsApp',
            isSpecialPage: true, // Marca esta tabla como especial
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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
                {
                    key: 'numero',
                    label: 'Número',
                    type: 'number'
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image'
                },
                {
                    key: 'pais_apertura',
                    label: 'País Apertura',
                    type: 'select',
                    relatedTable: 'paises'
                }
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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
                {
                    key: 'url',
                    label: 'URL',
                    type: 'text'
                },
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text'
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
                    key: 'experto_id',
                    label: 'Experto',
                    type: 'select',
                    relatedTable: 'expertos'
                },
                {
                    key: 'consejo_experto',
                    label: 'Consejo Experto',
                    type: 'text'
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image'
                },
                {
                    key: 'txt_search',
                    label: 'Texto Search',
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
                    key: 'mapa',
                    label: 'Coordenadas',
                    type: 'text'
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge'
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
                }
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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
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
                    key: 'icono',
                    label: 'Ícono',
                    type: 'image'
                },
                {
                    key: 'coordenadas_icono',
                    label: 'Coordenadas Ícono',
                    type: 'text'
                },
                {
                    key: 'coordenadas_icono_hover',
                    label: 'Coordenadas Ícono Hover',
                    type: 'text'
                },
                {
                    key: 'nro_orden',
                    label: 'Número de Orden',
                    type: 'number'
                },
                {
                    key: 'img_carousel',
                    label: 'Imagen Carousel',
                    type: 'image'
                },
                {
                    key: 'img_search',
                    label: 'Imagen Search',
                    type: 'image'
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
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge'
                },
                {
                    key: 'codigo_newton',
                    label: 'Código Newton',
                    type: 'number'
                },
                {
                    key: 'idExperto',
                    label: 'Experto',
                    type: 'select',
                    relatedTable: 'expertos'
                },
                {
                    key: 'consejo_experto',
                    label: 'Consejo Experto',
                    type: 'text'
                },
                {
                    key: 'url',
                    label: 'URL',
                    type: 'text'
                }
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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text'
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image'
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge'
                },
                {
                    key: 'codigo_newton',
                    label: 'Código Newton',
                    type: 'number'
                }
            ]
        },
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
                    key: 'nombreprod',
                    label: 'Nombre Producto',
                    type: 'text'
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
                    type: 'number'
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
                    type: 'text'
                },
                {
                    key: 'expertoId',
                    label: 'Experto',
                    type: 'select',
                    relatedTable: 'expertos'
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
                    type: 'badge'
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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
                {
                    key: 'descripcion',
                    label: 'Descripción',
                    type: 'text'
                },
                {
                    key: 'segundaDescripcion',
                    label: 'Segunda Descripción',
                    type: 'text'
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image'
                },
                {
                    key: 'nro_orden',
                    label: 'Número de Orden',
                    type: 'number'
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
                },
                {
                    key: 'segmentosExcluidos',
                    label: 'Segmentos Excluidos',
                    type: 'select',
                    relatedTable: 'segmentos'
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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
                {
                    key: 'titulo',
                    label: 'Título',
                    type: 'text'
                },
                {
                    key: 'texto',
                    label: 'Texto',
                    type: 'text'
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image'
                },
                {
                    key: 'nro_orden',
                    label: 'Número de Orden',
                    type: 'number'
                },
                {
                    key: 'categoriaId',
                    label: 'Categoría',
                    type: 'select',
                    relatedTable: 'categorias'
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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
                {
                    key: 'destino_id',
                    label: 'Destino',
                    type: 'select',
                    relatedTable: 'destinos',
                    required: true
                },
                {
                    key: 'segmentos_id',
                    label: 'Segmento',
                    type: 'select',
                    relatedTable: 'segmentos',
                    required: true
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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text'
                },
                {
                    key: 'tour',
                    label: 'Tour',
                    type: 'text'
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image'
                },
                {
                    key: 'rating',
                    label: 'Rating',
                    type: 'number'
                },
                {
                    key: 'comentario',
                    label: 'Comentario',
                    type: 'text'
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge'
                },
                {
                    key: 'destacado',
                    label: 'Destacado',
                    type: 'boolean'
                },
                {
                    key: 'producto_Id',
                    label: 'Producto',
                    type: 'select',
                    relatedTable: 'productos'
                },
                {
                    key: 'categoria_id',
                    label: 'Categoría',
                    type: 'select',
                    relatedTable: 'categorias'
                },
                {
                    key: 'destino_id',
                    label: 'Destino',
                    type: 'select',
                    relatedTable: 'destinos'
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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
                {
                    key: 'pregunta',
                    label: 'Pregunta',
                    type: 'text'
                },
                {
                    key: 'respuesta',
                    label: 'Respuesta',
                    type: 'text'
                },
                {
                    key: 'destino_id',
                    label: 'Destino',
                    type: 'select',
                    relatedTable: 'destinos'
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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
                {
                    key: 'titulo',
                    label: 'Título',
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
                    key: 'autor',
                    label: 'Autor',
                    type: 'text',
                    required: true
                },
                {
                    key: 'fecha',
                    label: 'Fecha',
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
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image'
                },
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text'
                }
            ]
        },
        {
            name: 'Países',
            slug: 'paises',
            icon: 'flag',
            endpoint: 'paises/paises',
            botonTexto: 'Crear nuevo país',
            showInNav: false,
            columns: [
                {
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
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
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge'
                }
            ]
        },
        {
            name: 'Ciudades',
            slug: 'ciudades',
            icon: 'building-community',
            endpoint: 'ciudades/ciudades',
            botonTexto: 'Crear nueva ciudad',
            showInNav: false,
            columns: [
                {
                    key: 'id',
                    label: 'ID',
                    type: 'number'
                },
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text'
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'badge'
                },
                {
                    key: 'paises_id',
                    label: 'País',
                    type: 'select',
                    relatedTable: 'paises'
                }
            ]
        }
    ]
}

export default tablas;