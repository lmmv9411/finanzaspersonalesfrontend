import { ref } from 'vue'
import { useMovementStore } from '../stores/movementStore'

export const useMovementform = () => {

    const movementStore = useMovementStore()

    const movement = ref({
        type: 'ingreso',
        amount: '',
        description: '',
        CategoryId: ''
    })

    const submitForm = async () => {

        movement.value.amount = valor.value.replace(/\D/g, ''); // Limpiar el valor antes de enviarlo

        await movementStore.addMovement(movement.value)
        resetForm()

    }

    // reiniciar formulario
    const resetForm = () => {
        movement.value = {
            type: 'ingreso',
            amount: '',
            description: '',
            categoryId: ''
        }
    }

    const valor = ref('');

    function formatearComoMoneda(event, isDom = true) {
        // Remover caracteres que no sean números
        let numeroLimpio = event;
        
        if (isDom) {
            numeroLimpio = event.target.value.replace(/\D/g, '');
        }

        // Si está vacío, limpiar el input
        if (numeroLimpio === '') {
            valor.value = '';
            return;
        }

        // Convertir a número y formatear
        const numero = parseInt(numeroLimpio, 10);

        // Convertir a número
        if (isNaN(numero)) {
            valor.value = '';
            return;
        }

        const formatoCOP = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        valor.value = formatoCOP.format(numero);
    }

    return { movement, submitForm, formatearComoMoneda, valor, movementStore }

}