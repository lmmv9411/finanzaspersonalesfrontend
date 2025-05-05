import axios from "axios"
import { defineStore } from "pinia"
import { ref } from "vue"
import { API_BASE_URL } from "../constants"
import { useMovementStore } from "./movementStore"

export const useBalanceStore = defineStore("balance", () => {

    const movementStore = useMovementStore()

    const startDate = ref('')
    const endDate = ref('')

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

    const getCurrentMonth = function () {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        startDate.value = `${year}-${month}-01 00:00:00`;
        endDate.value = new Date(year, month, 0).toISOString().split('T')[0] + ' 23:59:59';
        return `${year}-${month}`
    }

    const selectedMonth = ref(getCurrentMonth())

    const pick = () => {
        const [year, month] = selectedMonth.value.split('-');
        startDate.value = `${year}-${month}-01 00:00:00`;
        endDate.value = new Date(year, month, 0).toISOString().split('T')[0] + ' 23:59:59';
        movementStore.fetchBalance(startDate.value, endDate.value)
        getTotalByCategory(chartData);
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(value)
    }

    const getTotalByCategory = async () => {

        try {
            const resp = await axios(`${API_BASE_URL}/stats/totalByCategory?startDate=${startDate.value}&endDate=${endDate.value}`)
            const { data } = resp
            chartData.value.labels = data.map(d => d.Category.name)
            chartData.value.datasets[0].data = data.map(d => Number(d.total))
        } catch (e) {
            console.error('Error al cargar datos del gráfico:', e)
        }
    }

    return {
        selectedMonth,
        pick,
        formatCurrency,
        startDate,
        endDate,
        getTotalByCategory,
        chartData
    }
})