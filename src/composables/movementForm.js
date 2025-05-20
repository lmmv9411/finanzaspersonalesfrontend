import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useModalStore } from '../components/modal/store/modalStore'
import { useMovementStore } from '../stores/movementStore'

export const useMovementform = () => {

    const movementStore = useMovementStore()
    const modalStore = useModalStore();

    const movement = ref({
        type: 'ingreso',
        amount: '',
        description: '',
        CategoryId: ''
    })

    const submitForm = async (isEdit) => {

        movement.value.amount = valor.value.replace(/\D/g, ''); // Limpiar el valor antes de enviarlo

        Swal.fire({
            title: isEdit ? 'Editando' : 'Guardando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
            theme: 'auto'
        })

        const isSaved = await movementStore.saveMovement(movement.value, isEdit)

        Swal.close()

        modalStore.isRendered = false;

        if (isSaved) {
            Swal.fire({
                title: `Movimiento ${isEdit ? 'Editado' : 'Registrado'}`,
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
                title: `Error al ${isEdit ? 'Editar' : 'Registrar'} movimiento`,
                icon: "error",
                toast: true,
                position: "top",
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
                theme: 'auto'
            });
        }

        resetForm()

    }

    // reiniciar formulario
    const resetForm = () => {
        movement.value = {
            type: 'ingreso',
            amount: '',
            description: '',
            categoryId: '',
            id: ''
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

    return { movement, submitForm, formatearComoMoneda, valor, movementStore, modalStore }

}