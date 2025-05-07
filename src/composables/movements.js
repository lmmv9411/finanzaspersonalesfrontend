import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { API_BASE_URL } from "../constants";

export const useMovements = () => {

    const movements = ref([])
    const selectedMonth = ref('')
    const startDate = ref('')
    const endDate = ref('')

    const fetchMovements = async () => {

        try {
            const resp = await axios.get(`${API_BASE_URL}/movements/date?startDate=${startDate.value}&endDate=${endDate.value}`);
            movements.value = resp.data
        } catch (error) {
            console.error('Error al cargar movimientos', error)
        }
    }


    const getCurrentMonth = function () {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        startDate.value = `${year}-${month}-01`;
        endDate.value = new Date(year, month, 0).toISOString().split('T')[0];
        selectedMonth.value = `${year}-${month}`
    }

    watch(selectedMonth, (newValue) => {
        const [year, month] = newValue.split('-')
        startDate.value = `${year}-${month}-01 00:00:00`
        endDate.value = new Date(year, month, 0).toISOString().split('T')[0] + ' 23:59:59'
        fetchMovements()
    })

    onMounted(() => {
        getCurrentMonth()
        fetchMovements()
    })

    return { movements, fetchMovements, selectedMonth }
}