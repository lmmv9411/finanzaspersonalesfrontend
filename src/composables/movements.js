import { ref } from "vue";
import { API_BASE_URL } from "../constants";

export const useMovements = () => {

    const movements = ref([])

    const fetchMovements = async (init) => {

        try {
            const resp = await axios.get(`${API_BASE_URL}/movements/date?startDate=${sd}&endDate=${ed}`);
            movements.value = resp.data
            init ?? fetchBalance();

        } catch (error) {
            console.error('Error al cargar movimientos', error)
        }
    }

    return { movements, fetchMovements }
}