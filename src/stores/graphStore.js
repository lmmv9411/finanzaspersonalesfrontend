import api from "../constants/api";
import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";
import { useBalanceStore } from "./balanceStore";

export const useGraphStore = defineStore("graph", () => {

    const balanceStore = useBalanceStore();

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

    const chartKey = ref(0);

    const getTotalByCategory = async () => {

        const sd = balanceStore.startDate
        const ed = balanceStore.endDate

        try {
            const resp = await api.get(`/stats/totalByCategory?startDate=${sd}&endDate=${ed}`)
            const { data } = resp

            chartData.value.labels = data.map(d => d.Category.name)
            chartData.value.datasets[0].data = data.map(d => Number(d.total))

            chartKey.value += 1;

        } catch (e) {
            console.error('Error al cargar datos del gráfico:', e)
        }
    }

    watchEffect(() => {
        if (balanceStore.startDate && balanceStore.endDate) {
            getTotalByCategory();
        }
    })

    return { chartData, getTotalByCategory, chartKey };

})