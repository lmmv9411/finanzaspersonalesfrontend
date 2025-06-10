import { defineStore } from 'pinia';
import api from "../constants/api";
import { useBalanceStore } from './balanceStore';
import { useGraphStore } from './graphStore';
import { ref } from 'vue';

export const useMovementStore = defineStore('movement', () => {

    const balanceStore = useBalanceStore();
    const graphStore = useGraphStore();
    const isSaved = ref(false)
    const mov = ref({})

    const saveMovement = async (movement, isEdit) => {

        try {

            if (!isEdit) {
                await api.post('/movements', movement)
            } else {
                await api.put(`/movements/${movement.id}`, movement)
            }

            balanceStore.fetchBalance()
            graphStore.getTotalByCategory(balanceStore.startDate, balanceStore.endDate)

            isSaved.value = true
            mov.value = movement

        } catch (error) {
            isSaved.value = false
            console.error('Error al registrar movimiento', error)
        }
    }

    return { saveMovement, isSaved, mov }
})
