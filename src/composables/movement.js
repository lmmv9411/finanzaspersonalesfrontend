import { ref } from 'vue'
import { formatoMoneda } from '../constants'
import { useMovementStore } from '../stores/movementStore'
import { useNotifications } from './useNotifications'

export const useMovement = () => {

    const valor = ref('');
    const movementStore = useMovementStore()
    const {
        showError,
        showConfirm,
        showInfo,
        showLoading,
        showSuccess,
        close
    } = useNotifications()

    const submitForm = async (isEdit) => {

        movementStore.movement.amount = valor.value.replace(/\D/g, '');

        if (isEdit) {
            const confirm = await showConfirm('¿Desea Editar Registro?', 'Sí, Editar', 'Cancelar');

            if (!confirm.isConfirmed) {
                resetForm()
                showInfo('Edición Cancelada');
                history.back()
                return;
            }
        }

        showLoading(isEdit ? 'Editando' : 'Guardando...')

        await movementStore.saveMovement(isEdit)

        close()

        if (movementStore.isSaved) {
            showSuccess(`Movimiento ${isEdit ? 'editado' : 'registrado'} correctamente`, true);
        } else {
            showError(`Error al ${isEdit ? 'editar' : 'registrar'} movimiento`, true);
        }

        if (isEdit) {
            history.back()
        }

        resetForm()

    }

    const resetForm = () => {
        movementStore.movement = {
            type: 'ingreso',
            amount: '',
            description: '',
            CategoryId: 0,
            id: '',
            date: null
        }
        valor.value = ''
        movementStore.isSaved = false
    }

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

    return { movementStore, submitForm, handleInput, valor, formatoMoneda, resetForm }

}