// src/stores/movementStore.js
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import { onMounted, ref } from 'vue'

const api = 'http://192.168.1.45:3000/api'

export const useMovementStore = defineStore('movement', () => {
    const movements = ref([])
    const balance = ref({
        ingresos: 0,
        gastos: 0,
        balance: 0
    })

    const startDate = ref(new Date())
    const endDate = ref(new Date())


    const fetchMovements = async () => {
        try {
            const sd = startDate.value.toISOString().split('T')[0] + 'T00:00:00.000Z'
            const ed = endDate.value.toISOString().split('T')[0] + 'T23:59:59.999Z'
            const response = await fetch(`${api}/movements/date?startDate=${sd}&endDate=${ed}`)
            movements.value = await response.json()
            fetchBalance()
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
            const response = await fetch(`${api}/movements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movement)
            })

            if (!response.ok) {
                Swal.fire({
                    title: "Error al registrar movimiento",
                    icon: "error",
                    toast: true,
                    position: "top",
                    timer: 3000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                });
                throw new Error('Error al registrar el movimiento')
            } else {
                Swal.fire({
                    title: "Movimiento registrado",
                    icon: "success",
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            }

            const newMovement = await response.json()
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
            const sd = startDate.value.toISOString().split('T')[0] + 'T00:00:00.000Z'
            const ed = endDate.value.toISOString().split('T')[0] + 'T23:59:59.999Z'
            const res = await fetch(`${api}/movements/balance?startDate=${sd}&endDate=${ed}`)
            const data = await res.json()
            balance.value = data
        } catch (error) {
            console.error('Error al obtener el balance:', error)
        }
    }

    onMounted(() => {
        const d = new Date();

        startDate.value = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);

        endDate.value = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

        endDate.value.setMinutes(endDate.value.getMinutes() - endDate.value.getTimezoneOffset());
    })

    return { movements, balance, fetchBalance, fetchMovements, addMovement, startDate, endDate }
})
