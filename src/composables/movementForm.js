import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useModalStore } from '../components/modal/store/modalStore'
import { formatoMoneda } from '../constants'
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

        if (isEdit) {
            const confirm = await Swal.fire({
                title: '¿Desea Editar Registro?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, Editar',
                cancelButtonText: 'Cancelar',
                theme: 'auto'
            })
            if (!confirm.isConfirmed) {

                modalStore.showModal = false
                resetForm()

                Swal.fire({
                    title: `Edicion Cancelada`,
                    icon: "success",
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    theme: 'auto'
                });
                return;
            }
        }

        Swal.fire({
            title: isEdit ? 'Editando' : 'Guardando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
            theme: 'auto'
        })

        await movementStore.saveMovement(movement.value, isEdit)

        Swal.close()

        modalStore.isRendered = false;

        if (movementStore.isSaved) {
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

        modalStore.showModal = false

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
        movementStore.isSaved = false
    }

    const valor = ref('');

    function handleInput(event) {

        const numeroLimpio = event.target.value.replace(/\D/g, '');

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

        valor.value = formatoMoneda(numero)
    }

    return { movement, submitForm, handleInput, valor, modalStore, formatoMoneda }

}