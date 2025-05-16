import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useMovementStore } from '../stores/movementStore'

export const useMovementform = (emit) => {

    const movementStore = useMovementStore()

    const movement = ref({
        type: 'ingreso',
        amount: '',
        description: '',
        CategoryId: ''
    })

    const close = () => emit('close');

    const submitForm = async () => {

        movement.value.amount = valor.value.replace(/\D/g, ''); // Limpiar el valor antes de enviarlo

        Swal.fire({
            title: 'Guardando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
            theme: 'auto'
        })

        const resp = await movementStore.addMovement(movement.value)

        Swal.close()

        close()
        resetForm()

        if (resp) {
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
        } else {
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