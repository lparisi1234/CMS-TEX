const destinos = [
    {
        id: 10,
        codigo_newton: 1,
        url: 'europa',
        nombre: 'Europa',
        h1: 'Europa - Continente de Historia y Cultura',
        h2: 'Descubre la diversidad europea',
        video_mobile: '/images/Placeholder.png',
        video_desktop: '/images/Placeholder.png',
        experto_id: 1,
        consejo_experto: 'Europa ofrece una increíble diversidad cultural en distancias cortas',
        img: '/images/Placeholder.png',
        meta_titulo: 'Europa - Tours por el continente histórico',
        meta_descripcion: 'Explora Europa con nuestros tours especializados',
        meta_keywords: 'Europa, turismo, cultura, historia, arte',
        mapa: '50.0755,14.4378',
        estado: 'Activo',
        nro_orden: 1,
        subgrupos: [
            {
                id: 1,
                nombre: 'Viajes por Francia, Italia y España',
                nro_orden: 1,
                productos: ['3/2500254', '3/2500298', '3/2500314', '3/2505535']
            },
            {
                id: 2,
                nombre: 'Tours del Reino Unido',
                nro_orden: 2,
                productos: ['3/2505171', '2/61478', '2/61477']
            }
        ]
    },
    {
        id: 11,
        codigo_newton: 2,
        url: 'america-del-sur',
        nombre: 'América del Sur',
        h1: 'América del Sur - Naturaleza y Aventura',
        h2: 'Descubre la magia sudamericana',
        video_mobile: '/images/Placeholder.png',
        video_desktop: '/images/Placeholder.png',
        experto_id: 2,
        consejo_experto: 'Prepárate para paisajes únicos y culturas fascinantes',
        img: '/images/Placeholder.png',
        meta_titulo: 'América del Sur - Tours de aventura y naturaleza',
        meta_descripcion: 'Explora América del Sur con expertos locales',
        meta_keywords: 'América del Sur, aventura, naturaleza, turismo',
        mapa: '-14.2350,-51.9253',
        estado: 'Activo',
        nro_orden: 2,
        subgrupos: [
            {
                id: 3,
                nombre: 'Argentina y Patagonia',
                nro_orden: 1,
                productos: ['3/2500254', '3/2500298', '3/2505535']
            },
            {
                id: 4,
                nombre: 'Brasil y Colombia',
                nro_orden: 2,
                productos: ['3/2500314', '3/2505171', '2/61478']
            },
            {
                id: 5,
                nombre: 'Chile and Perú',
                nro_orden: 3,
                productos: ['2/61477', '3/2500254']
            }
        ]
    },
    {
        id: 1,
        codigo_newton: 3,
        url: 'francia',
        nombre: 'Francia',
        h1: 'Francia - País del Arte y la Elegancia',
        h2: 'Descubre la magia francesa',
        video_mobile: '/images/Placeholder.png',
        video_desktop: '/images/Placeholder.png',
        experto_id: 2,
        consejo_experto: 'Francia combina arte, gastronomía y paisajes únicos',
        img: '/images/Placeholder.png',
        meta_titulo: 'Francia - Guía completa del país del arte',
        meta_descripcion: 'Descubre Francia con nuestros tours especializados',
        meta_keywords: 'Francia, París, Torre Eiffel, Louvre, turismo',
        mapa: '46.2276,2.2137',
        estado: 'Activo',
        nro_orden: 3,
        region_id: 10,
        subgrupos: [
            {
                id: 6,
                nombre: 'París y Alrededores',
                nro_orden: 1,
                productos: ['3/2500298', '3/2500314', '3/2505171']
            },
            {
                id: 7,
                nombre: 'Provenza y Costa Azul',
                nro_orden: 2,
                productos: ['3/2500254', '3/2505535', '2/61478']
            }
        ]
    },
    {
        id: 2,
        codigo_newton: 4,
        url: 'reino-unido',
        nombre: 'Reino Unido',
        h1: 'Reino Unido - Tradición y Modernidad',
        h2: 'Tradición y modernidad en perfecta armonía',
        video_mobile: '/images/Placeholder.png',
        video_desktop: '/images/Placeholder.png',
        experto_id: 1,
        consejo_experto: 'No olvides llevar paraguas, el clima puede cambiar rápidamente',
        img: '/images/Placeholder.png',
        meta_titulo: 'Reino Unido - Tours por las islas británicas',
        meta_descripcion: 'Explora Reino Unido con guías expertos locales',
        meta_keywords: 'Reino Unido, Londres, Big Ben, Buckingham, turismo',
        mapa: '55.3781,-3.4360',
        estado: 'Activo',
        nro_orden: 4,
        region_id: 10,
        subgrupos: [
            {
                id: 8,
                nombre: 'Londres y Castillos',
                nro_orden: 1,
                productos: ['3/2500254', '3/2500298', '2/61477']
            },
            {
                id: 9,
                nombre: 'Escocia e Irlanda',
                nro_orden: 2,
                productos: ['3/2505535', '3/2505171', '2/61478']
            }
        ]
    },
    {
        id: 3,
        codigo_newton: 5,
        url: 'italia',
        nombre: 'Italia',
        h1: 'Italia - La Cuna del Arte',
        h2: 'Donde cada piedra cuenta una historia',
        video_mobile: '/images/Placeholder.png',
        video_desktop: '/images/Placeholder.png',
        experto_id: 3,
        consejo_experto: 'Reserva la entrada al Vaticano con anticipación para evitar colas',
        img: '/images/Placeholder.png',
        meta_titulo: 'Italia - Descubre la cuna del arte',
        meta_descripcion: 'Tours culturales por la histórica Italia',
        meta_keywords: 'Italia, Roma, Coliseo, Vaticano, historia',
        mapa: '41.8719,12.5674',
        estado: 'Activo',
        nro_orden: 5,
        region_id: 10,
        subgrupos: [
            {
                id: 10,
                nombre: 'Roma y Vaticano',
                nro_orden: 1,
                productos: ['3/2500314', '3/2505171', '2/61478', '2/61477']
            },
            {
                id: 11,
                nombre: 'Florencia y Toscana',
                nro_orden: 2,
                productos: ['3/2500254', '3/2500298', '3/2505535']
            }
        ]
    },
    {
        id: 4,
        codigo_newton: 6,
        url: 'españa',
        nombre: 'España',
        h1: 'España - Pasión y Tradición',
        h2: 'Arte, cultura y gastronomía ibérica',
        video_mobile: '/images/Placeholder.png',
        video_desktop: '/images/Placeholder.png',
        experto_id: 4,
        consejo_experto: 'Disfruta de las tapas y la siesta española',
        img: '/images/Placeholder.png',
        meta_titulo: 'España - Tours por la península ibérica',
        meta_descripcion: 'Descubre España con expertos locales',
        meta_keywords: 'España, Madrid, Barcelona, Prado, Retiro, tapas',
        mapa: '40.4637,-3.7492',
        estado: 'Activo',
        nro_orden: 6,
        region_id: 10,
        subgrupos: [
            {
                id: 12,
                nombre: 'Madrid y Castilla',
                nro_orden: 1,
                productos: ['3/2500298', '3/2500314', '2/61478']
            },
            {
                id: 13,
                nombre: 'Barcelona y Cataluña',
                nro_orden: 2,
                productos: ['3/2500254', '3/2505535', '3/2505171']
            },
            {
                id: 14,
                nombre: 'Andalucía',
                nro_orden: 3,
                productos: ['2/61477', '3/2500298']
            }
        ]
    },
    {
        id: 5,
        codigo_newton: 7,
        url: 'argentina',
        nombre: 'Argentina',
        h1: 'Argentina - Tierra de Pasión',
        h2: 'Tango, asado y paisajes infinitos',
        video_mobile: '/images/Placeholder.png',
        video_desktop: '/images/Placeholder.png',
        experto_id: 1,
        consejo_experto: 'Prueba un buen asado argentino y aprende a bailar tango',
        img: '/images/Placeholder.png',
        meta_titulo: 'Argentina - Tierra de tango y paisajes',
        meta_descripcion: 'Tours por Argentina con guías locales',
        meta_keywords: 'Argentina, Buenos Aires, tango, Patagonia, turismo',
        mapa: '-38.4161,-63.6167',
        estado: 'Activo',
        nro_orden: 7,
        region_id: 11,
        subgrupos: [
            {
                id: 15,
                nombre: 'Buenos Aires y Tango',
                nro_orden: 1,
                productos: ['3/2500254', '3/2500298', '3/2505171']
            },
            {
                id: 16,
                nombre: 'Patagonia y Glaciares',
                nro_orden: 2,
                productos: ['3/2500314', '3/2505535', '2/61478', '2/61477']
            }
        ]
    }
]

export default destinos