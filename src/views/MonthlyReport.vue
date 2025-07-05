<template>

    <div class="p-2">

        <h1 class="text-center text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Reporte Mensual de {{ reportTypeDisplay }}
        </h1>

        <div class="bg-slate-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <Line :data="chartData" :options="chartOptions" />
        </div>

        <div class="mt-8">

            <router-link :to="{ name: 'MonthlyReport', query: { type: 'todo' } }">
                <h2 class="text-center text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4"
                    title="Ver Todos los Reportes Mensuales">
                    Detalle Mensual
                </h2>
            </router-link>

            <div v-for="(item, index) in monthlyData" :key="index" class="mb-4 max-w-xl mx-auto">

                <div
                     class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md mb-2 flex gap-4 items-center justify-between">

                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {{ formatearMes(index) }}
                    </h3>

                    <p class="text-gray-600 dark:text-gray-300">
                        <span>Ingresos: </span>
                        <span class="text-green-500 dark:text-green-400">
                            {{ formatoMoneda(item.ingreso) }}
                        </span>
                    </p>
                    <p class="text-gray-600 dark:text-gray-300">
                        <span>Gastos: </span>
                        <span class="text-red-500 dark:text-red-400">
                            {{ formatoMoneda(item.gasto) }}
                        </span>
                    </p>
                    <p class="text-gray-600 dark:text-gray-300">
                        <span>Saldo: </span>
                        <span class="text-indigo-500 dark:text-indigo-300">
                            {{ formatoMoneda(item.saldo) }}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
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

watch(route, () => {
    reportType.value = route.query.type || 'ingreso';
    fetchMonthlyReport();
});

</script>