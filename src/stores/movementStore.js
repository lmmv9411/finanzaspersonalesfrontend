import { defineStore } from 'pinia';
import { useCategories } from '../composables/categories';
import api from "../constants/api";
import { useBalanceStore } from './balanceStore';
import { useGraphStore } from './graphStore';

export const useMovementStore = defineStore('movement', () => {

    const balanceStore = useBalanceStore();
    const graphStore = useGraphStore();
    const { categories } = useCategories()

    const addMovement = async (movement) => {

        try {

            await api.post('/movements', movement)

            balanceStore.fetchBalance()
            graphStore.getTotalByCategory(balanceStore.startDate, balanceStore.endDate)

            return true

        } catch (error) {
            console.error('Error al registrar movimiento', error)
            return false
        }
    }

    return { addMovement, categories }
})
