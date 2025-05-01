// src/stores/movementStore.js
import axios from 'axios'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import { onMounted, ref } from 'vue'
import { API_BASE_URL } from '../constants'

export const useMovementStore = defineStore('movement', () => {
    const movements = ref([])
    const balance = ref({
        ingresos: 0,
        gastos: 0,
        balance: 0
    })

    const startDate = ref(new Date())
    const endDate = ref(new Date())
    const categories = ref([])
    let sd, ed;


    const fetchMovements = async (init) => {

        try {
            const resp = await axios.get(`${API_BASE_URL}/movements/date?startDate=${sd}&endDate=${ed}`);
            movements.value = resp.data
            init ?? fetchBalance();

        } catch (error) {
            console.error('Error al cargar movimientos', error)
        }
    }

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

            const newMovement = resp.data
            movements.value.unshift(newMovement)
            await fetchBalance()
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

    const fetchBalance = async () => {

        try {
            const resp = await axios.get(`${API_BASE_URL}/movements/balance?startDate=${sd}&endDate=${ed}`)
            balance.value = resp.data
        } catch (error) {
            console.error('Error al obtener el balance:', error)
            Swal.fire({
                title: "Error al obtener balance",
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

    onMounted(async () => {
        const d = new Date();

        startDate.value = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);

        endDate.value = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

        endDate.value.setMinutes(endDate.value.getMinutes() - endDate.value.getTimezoneOffset());

        sd = startDate.value.toISOString().split('T')[0] + 'T00:00:00.000Z'
        ed = endDate.value.toISOString().split('T')[0] + 'T23:59:59.999Z'

        await fetchCategories();
    })

    return { movements, balance, fetchBalance, fetchMovements, addMovement, startDate, endDate, fetchCategories, categories }
})
