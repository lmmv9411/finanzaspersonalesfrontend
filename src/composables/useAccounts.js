import { reactive, ref } from "vue";
import { useNotifications } from "./useNotifications";
import { createAccount, deleteAccount, getAccounts, updateAccount, reconcileAccountBalance } from "../api/accounts";
import { formatoMoneda } from "../constants";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

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
        const { value: realBalance } = await Swal.fire({
            title: 'Reconciliar Saldo',
            input: 'text',
            inputLabel: `Saldo actual en ${account.name}: ${formatoMoneda(account.balance)}`,
            inputValue: formatoMoneda(account.balance),
            inputPlaceholder: 'Ingresa El Saldo Real De La Cuenta',
            showCancelButton: true,
            confirmButtonText: 'Reconciliar',
            cancelButtonText: 'Cancelar',
            didOpen: () => {
                const input = Swal.getInput();
                input.addEventListener('input', (event) => {
                    const cleanValue = event.target.value.replace(/\D/g, '');
                    event.target.value = cleanValue ? formatoMoneda(Number(cleanValue)) : '';
                });
            },
            preConfirm: (value) => {
                const parsedValue = Number((value || '').toString().replace(/\D/g, ''));
                if (Number.isNaN(parsedValue)) {
                    Swal.showValidationMessage('Ingresa un valor válido');
                    return null;
                }
                return parsedValue;
            }
        });

        if (realBalance === undefined || realBalance === null) {
            return;
        }
        if (realBalance === Number(account.balance)) {
            showInfo('El saldo es igual al actual, no hay cambios por reconciliar');
            return;
        }
        showLoading('Reconciliando saldo...');
        try {
            await reconcileAccountBalance(account.id, { realBalance });
            close();
            await fetchAccounts();
            showSuccess('Saldo reconciliado correctamente');
        } catch (error) {
            close();
            console.error('Error al reconciliar saldo', error);
            showError('No se pudo reconciliar el saldo');
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