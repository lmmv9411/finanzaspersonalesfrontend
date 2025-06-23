<template>
    <div class="flex flex-col sm:flex-row gap-4 sm:max-w-4xl m-auto">
        <div class="w-full max-w-md mx-auto dark:bg-gray-800 bg-slate-100 rounded shadow-2xl p-4">
            <h4 class="text-xl font-semibold dark:text-gray-300">Gasto Por Categoria</h4>
            <Doughnut :key="graphStore.chartKeyA" :data="graphStore.chartDataGasto" :options="chartOptions" />
        </div>
        <div class="w-full max-w-md mx-auto dark:bg-gray-800 bg-slate-100 rounded shadow-2xl p-4">
            <h4 class="text-xl font-semibold dark:text-gray-300">Ingreso Por Categoria</h4>
            <Doughnut :key="graphStore.chartKeyB" :data="graphStore.chartDataIngreso" :options="chartOptions" />
        </div>
    </div>
</template>

<script setup>
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { onMounted } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { useGraphStore } from '../stores/graphStore'
import { formatoMoneda } from '../constants'

ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels)

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'right',
        },
        datalabels: {
            formatter: (value, context) => {
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${percentage}%`
            },
            color: '#fff',
            font: {
                size: 12,
                weight: 'bold'
            }
        }
    }
}

const graphStore = useGraphStore();

onMounted(() => graphStore.getTotalByCategory())


</script>