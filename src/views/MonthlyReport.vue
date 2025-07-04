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
                        <tr v-for="(item, index) in monthlyData" :key="index"
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
import { onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import { useRoute } from 'vue-router';
import { useMonthlyReport } from '../composables/useMonthlyReport';

const {
    fetchMonthlyReport,
    monthlyData,
    formatearMes,
    formatoMoneda,
    chartData,
    chartOptions,
    reportType,
    reportTypeDisplay
} = useMonthlyReport();

const route = useRoute();

onMounted(() => {
    reportType.value = route.query.type || 'ingreso';
    fetchMonthlyReport()
});

</script>