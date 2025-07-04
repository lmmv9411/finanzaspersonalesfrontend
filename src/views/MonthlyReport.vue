<template>
    <div class="p-2">
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Reporte Mensual de {{ reportTypeDisplay
        }}</h1>
        <div class="bg-slate-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <Line :data="chartData" :options="chartOptions" />
        </div>
        <div class="mt-8">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Detalle Mensual</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-700 rounded-lg shadow-md">
                    <thead>
                        <tr>
                            <th
                                class="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-600 dark:text-gray-300">
                                Mes</th>
                            <th
                                class="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-600 dark:text-gray-300">
                                Ingresos</th>
                            <th
                                class="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-600 dark:text-gray-300">
                                Gastos</th>
                            <th
                                class="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-600 dark:text-gray-300">
                                Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in monthlyReportStore.monthlyData.data" :key="index"
                            class="hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td
                                class="py-2 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                                {{ formatearMes(index) }}
                            </td>
                            <td
                                class="py-2 px-4 border-b border-gray-300 dark:border-gray-600 text-green-500 dark:text-green-400">
                                {{
                                    formatoMoneda(item.ingreso) }}</td>
                            <td
                                class="py-2 px-4 border-b border-gray-300 dark:border-gray-600 text-red-500 dark:text-red-400">
                                {{
                                    formatoMoneda(item.gasto) }}</td>
                            <td
                                class="py-2 px-4 border-b border-gray-300 dark:border-gray-600 text-indigo-500 dark:text-indigo-300">
                                {{
                                    formatoMoneda(item.saldo) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { computed, onMounted, ref, watch } from 'vue';
import { Line } from 'vue-chartjs';
import { useRoute } from 'vue-router';
import { formatoMoneda } from '../constants';
import { useMonthlyReportStore } from '../stores/monthlyReportStore';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const formatoMes = new Intl.DateTimeFormat(navigator.language, { month: 'long' });

const route = useRoute();
const monthlyReportStore = useMonthlyReportStore();

const reportType = ref(route.query.type || 'ingreso');

const reportTypeDisplay = computed(() => {
    switch (reportType.value) {
        case 'ingreso': return 'Ingresos';
        case 'gasto': return 'Gastos';
        case 'saldo': return 'Saldo';
        default: return '';
    }
});

const formatearMes = (dateString) => {
    const [year, month] = dateString.split('-');
    const date = new Date(year, month - 1, 1);
    return formatoMes.format(date);
};

const chartData = computed(() => {

    const labels = Object.keys(monthlyReportStore.monthlyData?.data ?? {}).map((key) => {
        const [year, month] = key.split('-');
        const date = new Date(year, month - 1, 1);
        return formatoMes.format(date);
    });

    let data = []
    if (monthlyReportStore.monthlyData?.data !== undefined) {
        data = Object.entries(monthlyReportStore.monthlyData.data).map(([_, v]) => v[reportType.value]);
    }

    let borderColor, backgroundColor;
    switch (reportType.value) {
        case 'ingreso':
            borderColor = '#4CAF50'; // Green
            backgroundColor = '#81C784'; // Light Green
            break;
        case 'gasto':
            borderColor = '#F44336'; // Red
            backgroundColor = '#EF9A9A'; // Light Red
            break;
        case 'saldo':
            borderColor = '#3F51B5'; // Indigo
            backgroundColor = '#7986CB'; // Light Indigo
            break;
        default:
            borderColor = '#9E9E9E'; // Grey
            backgroundColor = '#E0E0E0'; // Light Grey
    }

    return {
        labels: labels,
        datasets: [
            {
                label: reportTypeDisplay.value,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                data: data,
                tension: 0.3
            }
        ]
    };
});

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            labels: {
                color: '#6B7280' // Tailwind gray-500
            }
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += formatoMoneda(context.parsed.y);
                    }
                    return label;
                }
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#6B7280' // Tailwind gray-500
            },
            grid: {
                color: '#6B7280' // Tailwind gray-600
            }
        },
        y: {
            ticks: {
                color: '#6B7280', // Tailwind gray-500
                callback: function (value) {
                    return formatoMoneda(value);
                }
            },
            grid: {
                color: '#6B7280' // Tailwind gray-600
            }
        }
    }
});

onMounted(() => {
    monthlyReportStore.fetchMonthlyReport();
});

watch(() => route.query.type, (newType) => {
    reportType.value = newType || 'ingreso';
});
</script>