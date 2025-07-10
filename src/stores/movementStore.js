import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from "../constants/api";

export const useMovementStore = defineStore('movement', () => {

    const isSaved = ref(false)

    const showPicker = ref(false)

    const movement = ref({
        type: 'ingreso',
        amount: '',
        description: '',
        CategoryId: 0,
        date: null
    })

    const saveMovement = async (isEdit) => {

        try {

            if (movement.value.date && showPicker.value) {
                const localDate = new Date(movement.value.date);
                movement.value.date = localDate.toISOString()
            }

            if (!isEdit) {
                await api.post('/movements', movement.value)
            } else {
                await api.put(`/movements/${movement.value.id}`, movement.value)
            }

            isSaved.value = true

        } catch (error) {
            isSaved.value = false
            console.error('Error al registrar movimiento', error)
        }
    }

    return { saveMovement, isSaved, movement, showPicker }
})
