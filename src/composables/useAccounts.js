import { reactive, ref } from "vue";
import { useNotifications } from "./useNotifications";
import { createAccount, deleteAccount, getAccounts, updateAccount } from "../api/accounts";
import { formatoMoneda } from "../constants";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useCategorieStore } from '../stores/categoriesStore';
import { useMovementStore } from '../stores/movementStore';

export const useAccounts = () => {

    const { showConfirm, showError, showInfo, showLoading, showSuccess, close } = useNotifications();

    const defaultType = 'mdi:credit-card-outline';

    const router = useRouter();

    const accounts = ref([]);
    const showForm = ref(false);
    const isEdit = ref(false);
    const showIconPicker = ref(false);
    const selectedIconName = ref('');
    const formattedAmount = ref('');
    const form = reactive({
        id: null,
        name: '',
        initialBalance: 0,
        type: defaultType
    });

    const movementStore = useMovementStore();
    const categoriesStore = useCategorieStore();

    const parseAmount = (value) => Number((value || '').replace(/\D/g, '') || 0);

    const mapAccount = (account) => (
        {
            ...account,
            type: account.type || defaultType,
            balance: Number(account.currentBalance ?? 0)
        });

    const fetchAccounts = async () => {
        try {
            const { data } = await getAccounts();
            const list = Array.isArray(data) ? data : (data.accounts ?? []);
            accounts.value = list.map(mapAccount);
        } catch (error) {
            console.error(error);
            showError('No se pudieron cargar las cuentas');
        }
    };

    const toggleForm = () => {
        showForm.value = !showForm.value;
        if (!showForm.value) {
            resetForm();
        }
    };

    const resetForm = () => {
        isEdit.value = false;
        showIconPicker.value = false;
        selectedIconName.value = '';
        form.id = null;
        form.name = '';
        form.initialBalance = 0;
        form.type = defaultType;
        formattedAmount.value = '';
    };

    const handleIconSelected = (iconData) => {
        form.type = iconData.icon;
        selectedIconName.value = iconData.name || '';
    };

    const handleAmountInput = (event) => {
        const amount = parseAmount(event.target.value);
        formattedAmount.value = amount ? formatoMoneda(amount) : '';
        form.initialBalance = amount;
    };

    const handleSubmit = async () => {
        if (!form.name) {
            showInfo('Debes ingresar un nombre de cuenta');
            return;
        }

        const payload = {
            name: form.name,
            initialBalance: form.initialBalance,
            type: form.type
        };

        showLoading(isEdit.value ? 'Actualizando cuenta...' : 'Guardando cuenta...');

        try {
            if (isEdit.value && form.id) {
                await updateAccount(form.id, payload);
            } else {
                await createAccount(payload);
            }

            close();
            showSuccess(`Cuenta ${isEdit.value ? 'actualizada' : 'creada'} correctamente`);
            await fetchAccounts();
            resetForm();
            showForm.value = false;
        } catch (error) {
            close();
            console.error(error);
            showError(`No se pudo ${isEdit.value ? 'actualizar' : 'crear'} la cuenta`);
        }
    };

    const startEdit = (account) => {
        showForm.value = true;
        isEdit.value = true;
        showIconPicker.value = false;
        form.id = account.id;
        form.name = account.name;
        form.type = account.type || defaultType;
        selectedIconName.value = '';
        form.initialBalance = Number(account.initialBalance ?? 0);
        formattedAmount.value = form.initialBalance ? formatoMoneda(form.initialBalance) : '';
    };

    const removeAccount = async (id) => {
        const confirm = await showConfirm('¿Eliminar cuenta?', 'Eliminar', 'Cancelar');

        if (!confirm.isConfirmed) {
            return;
        }

        showLoading('Eliminando cuenta...');

        try {
            await deleteAccount(id);
            close();
            showSuccess('Cuenta eliminada');
            await fetchAccounts();
        } catch (error) {
            close();
            console.error(error);
            showError('No se pudo eliminar la cuenta');
        }
    };

    const goToAccountMovements = (id) => {
        router.push({ name: 'AccountMovements', params: { id } });
    };

    const adjustBalance = async (account) => {
        const { value: newBalance } = await Swal.fire({
            title: 'Ajustar saldo',
            input: 'text',
            inputLabel: `Saldo actual en ${account.name}: ${formatoMoneda(account.balance)}`,
            inputValue: formatoMoneda(account.balance),
            showCancelButton: true,
            confirmButtonText: 'Ajustar',
            cancelButtonText: 'Cancelar',

            didOpen: () => {
                const input = Swal.getInput();

                input.addEventListener('input', (e) => {
                    let valor = e.target.value;

                    // quitar todo lo que no sea número
                    valor = valor.replace(/[^\d]/g, '');

                    if (valor === '') {
                        e.target.value = '';
                        return;
                    }

                    // convertir a número
                    const numero = Number(valor);

                    // formatear
                    e.target.value = formatoMoneda(numero);
                });
            }
        });

        if (newBalance !== undefined && newBalance !== null) {
            const cleanNewBalance = Number(newBalance.toString().replace(/\D/g, ''));
            const diff = cleanNewBalance - account.balance;

            if (diff === 0) {
                showError("Saldo iguales.")
                return
            } // No hay cambio

            const type = diff > 0 ? 'ingreso' : 'gasto';
            const amount = Math.abs(diff);

            try {
                // Buscamos una categoría para el ajuste (ej: "Otros" o la primera disponible)
                if (categoriesStore.categories.length === 0) await categoriesStore.getCategories();

                const category = categoriesStore.categories.find(c => c.name === 'ajuste')

                if (!category) {
                    showError(`No existe categoria "ajuste", creala antes de seguir.`)
                    return
                }

                showLoading('Realizando ajuste...');

                movementStore.movement = {
                    type,
                    amount: amount.toString(),
                    description: 'Ajuste de saldo manual',
                    CategoryId: category.id,
                    date: new Date(),
                    AccountId: account.id
                };

                await movementStore.saveMovement(false);
                await fetchAccounts();

                showSuccess('Saldo ajustado correctamente');

            } catch (error) {
                showError('Error al procesar el ajuste');
            }
        }
    };

    return {
        accounts,
        showForm,
        form,
        isEdit,
        showIconPicker,
        selectedIconName,
        formattedAmount,
        fetchAccounts,
        toggleForm,
        handleIconSelected,
        handleAmountInput,
        handleSubmit,
        startEdit,
        removeAccount,
        goToAccountMovements,
        adjustBalance
    };

}