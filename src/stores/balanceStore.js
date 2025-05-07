import axios from "axios"
import { defineStore } from "pinia"
import { ref } from "vue"
import { API_BASE_URL } from "../constants"
import { useGraphStore } from "./graphStore"

export const useBalanceStore = defineStore("balance", () => {

    const startDate = ref('')
    const endDate = ref('')
    const balance = ref({
        totalIngreso: 0,
        totalGasto: 0,
        balance: 0
    })

    const graphStore = useGraphStore()

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

        fetchBalance()
        graphStore.getTotalByCategory(startDate.value, endDate.value)
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(value)
    }

    const fetchBalance = async () => {

        try {
            const resp = await axios.get(`${API_BASE_URL}/movements/balance?startDate=${startDate.value}&endDate=${endDate.value}`)
            balance.value = resp.data
        } catch (error) {
            console.error('Error al obtener el balance:', error)
            Swal.fire({
                title: "Error al obtener balance",
                icon: "error",
                toast: true,
                position: "top",
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
            });
        }
    }

    return {
        selectedMonth,
        pick,
        formatCurrency,
        startDate,
        endDate,
        balance,
        fetchBalance
    }
})