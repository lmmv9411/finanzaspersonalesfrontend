// src/stores/movementStore.js
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import { ref } from 'vue'

const api = 'http://192.168.1.45:3000/api'

export const useMovementStore = defineStore('movement', () => {
    const movements = ref([])
    const balance = ref({
        ingresos: 0,
        gastos: 0,
        balance: 0
    })

    const fetchMovements = async () => {
        try {
            const response = await fetch(`${api}/movements`)
            movements.value = await response.json()
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
            movements.value.push(newMovement)
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
            const res = await fetch(`${api}/movements/balance`)
            const data = await res.json()
            balance.value = data
        } catch (error) {
            console.error('Error al obtener el balance:', error)
        }
    }

    return { movements, balance, fetchBalance, fetchMovements, addMovement }
})
