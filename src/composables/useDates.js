import { ref, watch } from 'vue';

export function useDateFilters() {
    const startDate = ref('');
    const endDate = ref('');

    const getCurrentMonthString = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    const selectedMonth = ref(getCurrentMonthString());

    const updateDatesFromMonth = (monthValue) => {
        if (!monthValue) return;
        const [year, month] = monthValue.split('-');
        startDate.value = `${year}-${month}-01 00:00:00`;
        endDate.value = new Date(year, month, 0).toISOString().split('T')[0] + ' 23:59:59';
    };

    const resetToCurrentMonth = () => {
        selectedMonth.value = getCurrentMonthString();
    };

    const toLocalDateTime = (dateString) => {

        if (!dateString) return '';

        const date = new Date(dateString);

        const pad = n => n.toString().padStart(2, '0');

        const year = date.getFullYear()
        const month = pad(date.getMonth() + 1)
        const day = pad(date.getDate())
        const hours = pad(date.getHours())
        const minutes = pad(date.getMinutes())

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    watch(selectedMonth, updateDatesFromMonth, { immediate: true });

    return {
        selectedMonth,
        startDate,
        endDate,
        resetToCurrentMonth,
        toLocalDateTime
    };
}
