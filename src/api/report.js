export const getMonthlyReport = async () => {
    // Simulación de llamada a la API
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { month: '2025-01', ingresos: 5000, gastos: 2000, saldo: 3000 },
                { month: '2025-02', ingresos: 5500, gastos: 2200, saldo: 3300 },
                { month: '2025-03', ingresos: 6000, gastos: 2500, saldo: 3500 },
                { month: '2025-04', ingresos: 5200, gastos: 2100, saldo: 3100 },
                { month: '2025-05', ingresos: 5800, gastos: 2300, saldo: 3500 },
                { month: '2025-06', ingresos: 6200, gastos: 2600, saldo: 3600 },
            ]);
        }, 500);
    });
};
