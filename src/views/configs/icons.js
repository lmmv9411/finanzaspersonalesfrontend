export const categoriesIcons = [
    {
        name: "Entretenimiento",
        icons: [
            { name: "Cine", icon: "mdi:movie" },
            { name: "Música", icon: "mdi:music" },
            { name: "Videojuegos", icon: "mdi:controller" },
            { name: "Eventos", icon: "mdi:ticket" }
        ]
    },
    {
        name: "Alimentos",
        icons: [
            { name: "Supermercado", icon: "mdi:cart" },
            { name: "Restaurante", icon: "mdi:silverware-fork-knife" },
            { name: "Café", icon: "mdi:coffee" },
            { name: "Bebidas", icon: "mdi:glass-cocktail" }
        ]
    },
    {
        name: "Compras",
        icons: [
            { name: "Ropa", icon: "mdi:tshirt-crew" },
            { name: "Electrónica", icon: "mdi:laptop" },
            { name: "Hogar", icon: "mdi:sofa" },
            { name: "Regalos", icon: "mdi:gift" }
        ]
    },
    {
        name: "Vida",
        icons: [
            { name: "Alquiler", icon: "mdi:home" },
            { name: "Servicios", icon: "mdi:water" },
            { name: "Mantenimiento", icon: "mdi:tools" }
        ]
    },
    {
        name: "Personal",
        icons: [
            { name: "Belleza", icon: "mdi:lipstick" },
            { name: "Gimnasio", icon: "mdi:dumbbell" },
            { name: "Cuidado", icon: "mdi:spa" }
        ]
    },
    {
        name: "Educación",
        icons: [
            { name: "Libros", icon: "mdi:book" },
            { name: "Cursos", icon: "mdi:school" },
            { name: "Material", icon: "mdi:pencil" }
        ]
    },
    {
        name: "Festival",
        icons: [
            { name: "Fiestas", icon: "mdi:party-popper" },
            { name: "Regalos", icon: "mdi:gift" }
        ]
    },
    {
        name: "Deportes",
        icons: [
            { name: "Fútbol", icon: "mdi:soccer" },
            { name: "Gimnasio", icon: "mdi:dumbbell" },
            { name: "Ciclismo", icon: "mdi:bike" }
        ]
    },
    {
        name: "Oficina",
        icons: [
            { name: "Material", icon: "mdi:briefcase" },
            { name: "Tecnología", icon: "mdi:laptop" },
            { name: "Impresión", icon: "mdi:printer" }
        ]
    },
    {
        name: "Transporte",
        icons: [
            { name: "Gasolina", icon: "mdi:gas-station" },
            { name: "Público", icon: "mdi:bus" },
            { name: "Vuelos", icon: "mdi:airplane" }
        ]
    },
    {
        name: "Salud",
        icons: [
            { name: "Farmacia", icon: "mdi:pharmacy" },
            { name: "Seguro", icon: "mdi:medical-bag" },
            { name: "Hospital", icon: "mdi:hospital" }
        ]
    },
    {
        name: "Viajes",
        icons: [
            { name: "Hoteles", icon: "mdi:hotel" },
            { name: "Turismo", icon: "mdi:map" },
            { name: "Equipaje", icon: "mdi:luggage" }
        ]
    },
    {
        name: "Finanzas",
        icons: [
            { name: "Ahorros", icon: "mdi:bank" },
            { name: "Inversiones", icon: "mdi:chart-line" },
            { name: "Préstamos", icon: "mdi:hand-coin" }
        ]
    },
    {
        name: "Otros",
        icons: [
            { name: "Misceláneo", icon: "mdi:dots-horizontal" },
            { name: "Reparaciones", icon: "mdi:wrench" }
        ]
    }
];

const colorClasses = [
    // Azules/Índigos
    'bg-gradient-to-br from-indigo-500 to-blue-600',
    'bg-gradient-to-br from-blue-400 to-indigo-600',
    'bg-gradient-to-br from-sky-500 to-blue-700',

    // Morados/Violetas
    'bg-gradient-to-br from-purple-500 to-pink-600',
    'bg-gradient-to-br from-violet-500 to-purple-600',
    'bg-gradient-to-br from-fuchsia-500 to-purple-700',

    // Verdes/Esmeraldas
    'bg-gradient-to-br from-emerald-500 to-teal-600',
    'bg-gradient-to-br from-green-500 to-emerald-700',
    'bg-gradient-to-br from-lime-400 to-green-600',

    // Rojos/Naranjas
    'bg-gradient-to-br from-rose-500 to-red-600',
    'bg-gradient-to-br from-orange-500 to-red-600',
    'bg-gradient-to-br from-amber-500 to-orange-600',

    // Extra: Gradientes más exóticos
    'bg-gradient-to-br from-cyan-400 to-blue-600',
    'bg-gradient-to-br from-pink-500 to-rose-600',
    'bg-gradient-to-br from-teal-400 to-cyan-600',
    'bg-gradient-to-br from-amber-400 to-orange-500'
];

export const getRandomBgColor = (iconName) => {
    // Genera un índice consistente basado en el nombre
    const hash = Array.from(iconName).reduce((acc, char) => (char.charCodeAt(0) * 31 + acc) >>> 0, 0);
    return colorClasses[hash % colorClasses.length];
};