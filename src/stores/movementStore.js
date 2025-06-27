import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from "../constants/api";
import { useBalanceStore } from './balanceStore';
import { useGraphStore } from './graphStore';

export const useMovementStore = defineStore('movement', () => {

    const balanceStore = useBalanceStore();
    const graphStore = useGraphStore();
    const isSaved = ref(false)

    const movement = ref({
        type: 'ingreso',
        amount: '',
        description: '',
        CategoryId: 0
    })


    const saveMovement = async (isEdit) => {

        try {

            if (!isEdit) {
                await api.post('/movements', movement.value)
            } else {
                await api.put(`/movements/${movement.value.id}`, movement.value)
            }

            balanceStore.fetchBalance()
            graphStore.getTotalByCategory(balanceStore.startDate, balanceStore.endDate)

            isSaved.value = true

        } catch (error) {
            isSaved.value = false
            console.error('Error al registrar movimiento', error)
        }
    }

    return { saveMovement, isSaved, movement }
})
