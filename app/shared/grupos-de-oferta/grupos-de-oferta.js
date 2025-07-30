const titulo = "Grupos de Oferta";
const subtitulo = "Listado de grupos de ofertas especiales y promociones disponibles.";

const gruposDeOferta = [
    {
        id: 1,
        descripcion: "Ofertas Especiales Verano",
        segundaDescripcion: "Descuentos exclusivos para la temporada de verano",
        img_desktop: "/images/Placeholder.png",
        img_tablet: "/images/Placeholder.png",
        img_mobile: "/images/Placeholder.png",
        nro_orden: 1,
        url: "verano-especial",
        estado: "Activo",
        segmentosExcluidos: '2',
        titulo: "Grupos de Oferta",
        subtitulo: "Listado de grupos de ofertas especiales y promociones disponibles."
    },
    {
        id: 2,
        descripcion: "Promociones Latinoamérica",
        segundaDescripcion: "Tours con descuentos especiales para destinos latinoamericanos",
        img_desktop: "/images/Placeholder.png",
        img_tablet: "/images/Placeholder.png",
        img_mobile: "/images/Placeholder.png",
        nro_orden: 2,
        url: "latam-promociones",
        estado: "Activo",
        segmentosExcluidos: '1',
        titulo: "Grupos de Oferta",
        subtitulo: "Listado de grupos de ofertas especiales y promociones disponibles."
    },
    {
        id: 3,
        descripcion: "Black Friday Tours",
        segundaDescripcion: "Ofertas imperdibles por tiempo limitado",
        img_desktop: "/images/Placeholder.png",
        img_tablet: "/images/Placeholder.png",
        img_mobile: "/images/Placeholder.png",
        nro_orden: 3,
        url: "black-friday",
        estado: "Inactivo",
        segmentosExcluidos: '1,2',
        titulo: "Grupos de Oferta",
        subtitulo: "Listado de grupos de ofertas especiales y promociones disponibles."
    }
]

export default gruposDeOferta;
