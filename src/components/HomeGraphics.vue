<template>
    <div class="w-full max-w-md mx-auto dark:bg-slate-800 bg-slate-100 rounded shadow-2xl p-4">
        <h4 class="text-xl font-semibold dark:text-gray-300">Total Por Categoria Mes</h4>
        <Pie v-if="hasData" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js'
import { computed, onMounted, ref } from 'vue'
import { Pie } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { API_BASE_URL } from '../constants'

ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels)

const chartData = ref({
    labels: [],
    datasets: [{
        label: 'total',
        data: [],
        backgroundColor: [
            '#60a5fa', '#f87171', '#34d399', '#fbbf24',
            '#a78bfa', '#fb7185', '#facc15', '#38bdf8'
        ]
    }]
})

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        datalabels: {
            formatter: (value, context) => {
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${percentage}%`
            },
            color: '#fff',
            font: {
                size: 16,
                weight: 'bold'
            }
        }
    }
}

onMounted(async () => {

    const d = new Date();

    const startDate = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);

    const endDate = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

    endDate.setMinutes(endDate.getMinutes() - endDate.getTimezoneOffset());

    const sd = startDate.toISOString().split('T')[0] + 'T00:00:00.000Z'
    const ed = endDate.toISOString().split('T')[0] + 'T23:59:59.999Z'

    try {
        const res = await fetch(`${API_BASE_URL}/stats/totalByCategory?startDate=${sd}&endDate=${ed}`)
        const data = await res.json()
        chartData.value.labels = data.map(d => d.Category.name)
        chartData.value.datasets[0].data = data.map(d => Number(d.total))
    } catch (e) {
        console.error('Error al cargar datos del gráfico:', e)
    }
})

const hasData = computed(() => {
    return chartData.value.datasets[0].data.length > 0
})

</script>