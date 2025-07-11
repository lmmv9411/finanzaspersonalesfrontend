import { ref, watchEffect } from 'vue';

export function useDateFilters() {
    const startDate = ref('');
    const endDate = ref('');

    const getCurrentMonthString = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        return { year, month };
    };

    const selectedMonth = ref(getCurrentMonthString());

    const updateDatesFromMonth = () => {
        if (!selectedMonth.value) return;
        const { year, month } = selectedMonth.value;
        startDate.value = `${year}-${month + 1}-01 00:00:00`;
        endDate.value = new Date(year, month + 1, 0).toISOString().split('T')[0] + ' 23:59:59';
    };

    const resetToCurrentMonth = () => selectedMonth.value = getCurrentMonthString();

    function getTimezoneOffsetString() {
        const offsetMinutes = new Date().getTimezoneOffset(); // Ej: 300 para UTC-5
        const sign = offsetMinutes > 0 ? '-' : '+';
        const absMinutes = Math.abs(offsetMinutes);
        const hours = String(Math.floor(absMinutes / 60)).padStart(2, '0');
        const minutes = String(absMinutes % 60).padStart(2, '0');
        return `${sign}${hours}:${minutes}`;
    }

    watchEffect(() => selectedMonth.value && updateDatesFromMonth())

    return {
        selectedMonth,
        startDate,
        endDate,
        resetToCurrentMonth,
        getTimezoneOffsetString
    };
}
