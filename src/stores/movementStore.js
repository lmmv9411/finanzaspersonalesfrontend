import { defineStore } from 'pinia';
import Swal from 'sweetalert2';
import { useCategories } from '../composables/categories';
import api from "../constants/api";
import { useBalanceStore } from './balanceStore';
import { useGraphStore } from './graphStore';

export const useMovementStore = defineStore('movement', () => {

    const balanceStore = useBalanceStore();
    const graphStore = useGraphStore();
    const { categories } = useCategories()

    const addMovement = async (movement) => {

        Swal.fire({
            title: 'Guardando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
            theme: 'auto'
        })

        try {

            await api.post('/movements', movement)

            Swal.fire({
                title: "Movimiento registrado",
                icon: "success",
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                theme: 'auto'
            });

            balanceStore.fetchBalance()
            graphStore.getTotalByCategory(balanceStore.startDate, balanceStore.endDate)

        } catch (error) {
            console.error('Error al registrar movimiento', error)
            Swal.fire({
                title: "Error al registrar movimiento",
                icon: "error",
                toast: true,
                position: "top",
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
                theme: 'auto'
            });
        }
    }

    return { addMovement, categories }
})
