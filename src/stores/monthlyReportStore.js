import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getMonthlyReport } from '../api/report';

export const useMonthlyReportStore = defineStore('monthlyReport', () => {
    const monthlyData = ref([]);

    const fetchMonthlyReport = async () => {
        const { data } = await getMonthlyReport();
        monthlyData.value = data
    };

    return {
        monthlyData,
        fetchMonthlyReport
    };
});
