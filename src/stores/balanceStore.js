import { defineStore } from "pinia"
import Swal from "sweetalert2"
import { ref, watch } from "vue"
import api from '../constants/api'

export const useBalanceStore = defineStore("balance", () => {

    const startDate = ref('')
    const endDate = ref('')
    const balance = ref({
        totalIngreso: 0,
        totalGasto: 0,
        balance: 0
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

    watch(selectedMonth, (newVal) => {
        const [year, month] = newVal.split('-');
        startDate.value = `${year}-${month}-01 00:00:00`;
        endDate.value = new Date(year, month, 0).toISOString().split('T')[0] + ' 23:59:59';
    })

    watch([startDate, endDate], async () => await fetchBalance())

    const fetchBalance = async () => {

        try {
            const resp = await api.get(`/movements/balance?startDate=${startDate.value}&endDate=${endDate.value}`)
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
        startDate,
        endDate,
        balance,
        fetchBalance
    }
})