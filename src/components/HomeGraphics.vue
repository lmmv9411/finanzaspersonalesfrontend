<template>
    <div class="w-full max-w-3xl mx-auto">
        <Bar
             id="my-chart-id"
             :data="chartData"
             :options="chartOptions" />
    </div>
</template>

<script setup>
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = ref({
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
    datasets: [
        {
            label: 'Ingresos',
            data: [4000, 20000, 12000, 5000],
            backgroundColor: 'rgba(34, 197, 94, 0.6)'
        },
        {
            label: 'Gastos',
            data: [9000, 11000, 7000, 13000, 20000],
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
        }
    ]
})

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top'
        },
        title: {
            display: true,
            text: 'Ingresos y Gastos Por Mes',
            font: {
                size: 20
            }
        }
    }
}

</script>