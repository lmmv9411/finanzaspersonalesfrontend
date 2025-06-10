const PORT = 3000;
export const BASE_URL = `${location.protocol}//${location.hostname}:${PORT}`
export const API_BASE_URL = `${BASE_URL}/api`;

const moneda = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
})

export const formatoMoneda = (valor) => moneda.format(valor);