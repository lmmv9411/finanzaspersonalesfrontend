import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { getBalance } from "../api/balance";
import { useNotifications } from "../composables/useNotifications";
import { useDateFilters } from "../composables/useDates";

export const useBalanceStore = defineStore("balance", () => {

    const { showError } = useNotifications();
    const { selectedMonth, startDate, endDate } = useDateFilters();

    const balance = ref({
        totalIngreso: 0,
        totalGasto: 0,
        balance: 0
    });

    const fetchBalance = async () => {
        try {
            const resp = await getBalance({ startDate: startDate.value, endDate: endDate.value });
            balance.value = resp.data;
        } catch (error) {
            console.error('Error al obtener el balance:', error);
            showError('Error al obtener balance');
        }
    };

    watch([startDate, endDate], fetchBalance, { immediate: true });

    return {
        selectedMonth,
        startDate,
        endDate,
        balance,
        fetchBalance
    };
});