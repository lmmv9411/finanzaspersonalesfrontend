import api from "../constants/api";
import { defineStore } from "pinia";
import { ref, watch, watchEffect } from "vue";
import { useBalanceStore } from "./balanceStore";

export const useGraphStore = defineStore("graph", () => {

    const balanceStore = useBalanceStore();

    const chartDataIngreso = ref({
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

    const chartDataGasto = ref({
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

    const chartKeyA = ref(0)
    const chartKeyB = ref(1)

    const getTotalByCategory = async () => {

        const sd = balanceStore.startDate
        const ed = balanceStore.endDate

        try {
            const resp = await api.get(`/stats/totalByCategory?startDate=${sd}&endDate=${ed}`)
            const { data } = resp

            chartDataGasto.value.labels = data.totalGastoByCategory.map(d => d.Category.name)
            chartDataGasto.value.datasets[0].data = data.totalGastoByCategory.map(d => Number(d.total))

            chartDataIngreso.value.labels = data.totalIngresoByCategory.map(d => d.Category.name)
            chartDataIngreso.value.datasets[0].data = data.totalIngresoByCategory.map(d => Number(d.total))

            chartKeyA.value += 1
            chartKeyB.value += 1

        } catch (e) {
            console.error('Error al cargar datos del gráfico:', e)
        }
    }

    watch(
        () => [balanceStore.startDate, balanceStore.endDate],
        () => getTotalByCategory()
    )

    return { chartDataIngreso, chartDataGasto, getTotalByCategory, chartKeyA, chartKeyB };

})