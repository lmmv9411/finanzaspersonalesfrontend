// src/stores/movementStore.js
import axios from 'axios'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import { onMounted, ref } from 'vue'
import { API_BASE_URL } from '../constants'
import { useBalanceStore } from './balanceStore'
import { useGraphStore } from './graphStore'

export const useMovementStore = defineStore('movement', () => {

    const balanceStore = useBalanceStore();
    const graphStore = useGraphStore();

    const categories = ref([])

    const addMovement = async (movement) => {

        Swal.fire({
            title: 'Guardando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })

        try {

            const resp = await axios.post(`${API_BASE_URL}/movements`, movement)

            Swal.fire({
                title: "Movimiento registrado",
                icon: "success",
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
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
            });
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`)
            const data = await response.json()
            categories.value = data
        } catch (error) {
            console.error('Error al cargar categorías')
        }
    }

    onMounted(async () => await fetchCategories())

    return { addMovement, fetchCategories, categories }
})
