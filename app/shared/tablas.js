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
                    type: 'boolean',
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
                    type: 'boolean',
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
                    type: 'boolean',
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
                    size: '140px x 60px',
                    required: true
                },
                {
                    key: 'codigo',
                    label: 'Código Newton',
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
                },
                {
                    key: 'nomenclatura',
                    label: 'Nomenclatura',
                    type: 'text',
                    required: true
                },
                {
                    key: 'segmentos_id',
                    label: 'Segmentos Excluidos',
                    type: 'checkbox-multiple',
                    relatedTable: 'segmentos',
                }
            ]
        },
        {
            name: 'Número de WhatsApp',
            slug: 'whatsapp',
            icon: 'brand-whatsapp',
            endpoint: 'whatsapp/whatsapp',
            botonTexto: 'Editar número de WhatsApp',
            isSpecialPage: true,
            columns: [
                {
                    key: 'whatsapp',
                    label: 'Whatsapp',
                    type: 'text',
                    required: true
                },
            ]
        },
        {
            name: 'Países Operativos',
            slug: 'paises-operativos',
            icon: 'flag',
            endpoint: 'paises/paises',
            botonTexto: 'Crear nuevo país operativo',
            columns: [
                {
                    key: 'nombre',
                    label: 'Nombre',
                    type: 'text',
                    required: true
                },
                {
                    key: 'numero_telefono',
                    label: 'Número de Teléfono',
                    type: 'text'
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                    size: '32px x 32px',
                    required: true
                },
                {
                    key: 'pais_apertura',
                    label: 'País Apertura',
                    type: 'text',
                    required: true
                },
                {
                    key: 'segmentos_id',
                    label: 'Segmento',
                    type: 'select',
                    relatedTable: 'segmentos',
                    required: true
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
                    key: 'cod_newton',
                    label: 'Código Newton',
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
                    key: 'nombre',
                    label: 'Nombre',
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
                    key: 'video_mobile',
                    label: 'Video Mobile',
                    type: 'image',
                    size: '510px x 260px',
                    required: true
                },
                {
                    key: 'video_desktop',
                    label: 'Video Desktop',
                    type: 'image',
                    size: '670px x 460px',
                    required: true
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                    size: '650px x 360px',
                    required: true
                },
                {
                    key: 'mapa',
                    label: 'Coordenadas',
                    type: 'text',
                    required: true
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'boolean',
                    required: true
                },
                {
                    key: 'nro_orden',
                    label: 'Número de Orden',
                    type: 'number'
                },
                {
                    key: 'region_id',
                    label: 'Región',
                    type: 'select',
                    relatedTable: 'destinos'
                },
                {
                    key: 'experto_id',
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
                    key: 'subgrupos',
                    label: 'Subgrupos',
                    type: 'array',
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
                    size: '40px x 40px',
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
                    size: '215px x 260px',
                    required: true
                },
                {
                    key: 'img_search',
                    label: 'Imagen Search',
                    type: 'image',
                    size: '650px x 360px',
                    required: true
                },
                {
                    key: 'video_mobile',
                    label: 'Video Mobile',
                    type: 'image',
                    size: '510px x 260px',
                    required: true
                },
                {
                    key: 'video_desktop',
                    label: 'Video Desktop',
                    type: 'image',
                    size: '670px x 460px',
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
                    type: 'boolean',
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
                    type: 'image',
                    size: '16px x 16px'
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
                    size: '72px x 72px',
                    required: true
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'boolean',
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
                    type: 'image',
                    size: '970px x 400px'
                },
                {
                    key: 'imagen_mobile',
                    label: 'Imagen Mobile',
                    type: 'image',
                    size: '320px x 220px'
                },
                {
                    key: 'video_mapa_mobile',
                    label: 'Video Mapa Mobile',
                    type: 'image',
                    size: '970px x 470px'
                },
                {
                    key: 'video_mapa_desktop',
                    label: 'Video Mapa Desktop',
                    type: 'image',
                    size: '290px x 160px'
                },
                {
                    key: 'podcast',
                    label: 'Podcast',
                    type: 'text'
                },
                {
                    key: 'cod_newton',
                    label: 'Código',
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
                    type: 'boolean',
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
                    key: 'segunda_descripcion',
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
                    size: '30px x 30px',
                    required: true
                },
                {
                    key: 'img_tablet',
                    label: 'Imagen Tablet',
                    type: 'image',
                    size: '30px x 30px',
                    required: true
                },
                {
                    key: 'img_mobile',
                    label: 'Imagen Mobile',
                    type: 'image',
                    size: '30px x 30px',
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
                    type: 'boolean',
                    required: true
                },
                {
                    key: 'segmentos_id',
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
                    key: 'descripcion',
                    label: 'Texto',
                    type: 'text',
                    required: true
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                    size: '48px x 48px',
                    required: true
                },
                {
                    key: 'nro_orden',
                    label: 'Número de Orden',
                    type: 'number',
                    required: true
                },
                {
                    key: 'categoria_id',
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
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                    size: '180px x 100px',
                    required: true
                },
                {
                    key: 'segmentos_id',
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
                    size: '48px x 48px',
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
                    type: 'boolean',
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
            endpoint: 'notadeprensa/notadeprensa',
            botonTexto: 'Crear nueva nota de prensa',
            columns: [
                {
                    key: 'descripcion',
                    label: 'Descripción',
                    type: 'text',
                    required: true
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                    size: '300px x 80px',
                    required: true
                },
                {
                    key: 'url',
                    label: 'URL',
                    type: 'text',
                    required: true
                },
                {
                    key: 'nro_orden',
                    label: 'Número de Orden',
                    type: 'number'
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'boolean',
                    required: true
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
                    required: true
                },
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                    size: '300px x 130px',
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
                    key: 'nro_orden',
                    label: 'Número de Orden',
                    type: 'number'
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'boolean',
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
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                    size: '80px x 80px',
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
            name: 'Traducciones',
            slug: 'traducciones',
            icon: 'book',
            endpoint: 'traducciones/traducciones',
            botonTexto: 'Crear nueva traducción',
            columns: [
                {
                    key: 'img',
                    label: 'Imagen',
                    type: 'image',
                    size: '80px x 80px',
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
            name: 'Personalizar',
            slug: 'personalizar',
            endpoint: 'personalizar/personalizar',
            botonTexto: 'Crear nueva traducción',
            showInNav: false,
            columns: [
                {
                    key: 'cod_newton',
                    label: 'Código Newton',
                    type: 'text',
                    required: true
                },
                {
                    key: 'traduccion_titulo',
                    label: 'Traducción Título',
                    type: 'text',
                    required: true
                },
                {
                    key: 'descripcion',
                    label: 'Descripción',
                    type: 'text',
                    required: true
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'boolean',
                    required: true
                },
            ]
        },
        {
            name: 'Categoría Hotelera',
            slug: 'categoria_hotelera',
            endpoint: 'categoria_hotelera/categoria_hotelera',
            botonTexto: 'Crear nueva traducción',
            showInNav: false,
            columns: [
                {
                    key: 'operador_id',
                    label: 'Operador',
                    type: 'select',
                    relatedTable: 'operadores',
                },
                {
                    key: 'cod_newton',
                    label: 'Código Newton',
                    type: 'text',
                    required: true
                },
                {
                    key: 'traduccion',
                    label: 'Traducción',
                    type: 'text',
                    required: true
                },
                {
                    key: 'estado',
                    label: 'Estado',
                    type: 'boolean',
                    required: true
                },
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
                    key: 'cod_newton',
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
                    type: 'boolean',
                    required: true
                },
                {
                    key: 'destino_id',
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
                    size: '215px x 130px',
                },
            ]
        }
    ]
}

export default tablas;