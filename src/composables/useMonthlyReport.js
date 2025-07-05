import {
    CategoryScale, Chart as ChartJS,
    Legend, LinearScale, LineElement, PointElement, Title, Tooltip
} from 'chart.js';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { formatoMoneda } from '../constants';
import { useMonthlyReportStore } from '../stores/monthlyReportStore';

export const useMonthlyReport = () => {

    ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

    const formatoMes = new Intl.DateTimeFormat(navigator.language, { month: 'long' });

    const { fetchMonthlyReport } = useMonthlyReportStore();
    const { monthlyData } = storeToRefs(useMonthlyReportStore());

    const reportType = ref('ingreso');

    const reportTypeDisplay = computed(() =>
        reportType.value.replace(/^\w/, (c) => c.toUpperCase())
    );

    const formatearMes = (dateString) => {
        const [year, month] = dateString.split('-');
        const date = new Date(year, month - 1, 1);
        return formatoMes.format(date).replace(/^\w/, (c) => c.toUpperCase());
    };

    const chartData = computed(() => {

        let dataset = [], labels = [];

        if (typeof monthlyData.value === 'object' && Object.keys(monthlyData.value).length > 0) {

            if (reportType.value === 'todo') {
                for (const type of ['ingreso', 'gasto', 'saldo']) {
                    dataset.push(createDataSet(type));
                }
            } else {
                dataset = [createDataSet(reportType.value)];
            }

            labels = Object.keys(monthlyData.value).map((key) => formatearMes(key));
        }

        return { labels, datasets: [...dataset] };
    });

    const createDataSet = (type) => {
        let data = [];
        let borderColor, backgroundColor;

        data = Object.entries(monthlyData.value).map(([_, v]) => v[type]);


        switch (type) {
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
            label: type,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            data: data,
            tension: 0.3
        }

    }

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

    return {
        formatoMes,
        fetchMonthlyReport,
        monthlyData,
        formatearMes,
        chartData,
        formatoMoneda,
        chartOptions,
        reportType,
        reportTypeDisplay
    };
}