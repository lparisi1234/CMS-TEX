const gruposDeOferta = [
    {
        id: 1,
        descripcion: "Ofertas Especiales Verano",
        segundaDescripcion: "Descuentos exclusivos para la temporada de verano",
        img: "/images/Placeholder.png",
        nro_orden: 1,
        url: "/ofertas/verano-especial",
        estado: "Activo",
        segmentosExcluidos: '2'
    },
    {
        id: 2,
        descripcion: "Promociones Latinoamérica",
        segundaDescripcion: "Tours con descuentos especiales para destinos latinoamericanos",
        img: "/images/Placeholder.png",
        nro_orden: 2,
        url: "/ofertas/latam-promociones",
        estado: "Activo",
        segmentosExcluidos: '1'
    },
    {
        id: 3,
        descripcion: "Black Friday Tours",
        segundaDescripcion: "Ofertas imperdibles por tiempo limitado",
        img: "/images/Placeholder.png",
        nro_orden: 3,
        url: "/ofertas/black-friday",
        estado: "Inactivo",
        segmentosExcluidos: '1,2'
    }
]

export default gruposDeOferta
