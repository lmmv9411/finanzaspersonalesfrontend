import { defineStore } from "pinia";
import { ref } from "vue";
import { API_BASE_URL } from "../constants";
import axios from "axios";

export const useGraphStore = defineStore("graph", () => {

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


    const getTotalByCategory = async (sd, ed) => {

        try {
            const resp = await axios(`${API_BASE_URL}/stats/totalByCategory?startDate=${sd}&endDate=${ed}`)
            const { data } = resp
            chartData.value.labels = data.map(d => d.Category.name)
            chartData.value.datasets[0].data = data.map(d => Number(d.total))
        } catch (e) {
            console.error('Error al cargar datos del gráfico:', e)
        }
    }

    return { chartData, getTotalByCategory };

})