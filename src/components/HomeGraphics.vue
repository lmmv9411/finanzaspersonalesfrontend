<template>
    <div class="w-full max-w-md mx-auto dark:bg-slate-800 bg-slate-100 rounded shadow-2xl p-4">
        <h4 class="text-xl font-semibold dark:text-gray-300">Total Por Categoria Mes</h4>
        <Pie v-if="hasData" :data="graphStore.chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { computed, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import { useBalanceStore } from '../stores/balanceStore'
import { useGraphStore } from '../stores/graphStore'

ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels)

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

const graphStore = useGraphStore();
const balanceStore = useBalanceStore();

onMounted(() => graphStore.getTotalByCategory(balanceStore.startDate, balanceStore.endDate))

const hasData = computed(() => graphStore.chartData.datasets[0].data.length > 0)

</script>