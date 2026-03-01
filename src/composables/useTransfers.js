import { storeToRefs } from "pinia";
import { useDateFilters } from "./useDates";
import { useNotifications } from "./useNotifications";
import { useThemeStore } from "./useTheme";
import { onMounted, reactive, ref, watch } from "vue";
import { createTransfer, deleteTransfer, getTransfers } from "../api/transfers";
import { formatoMoneda } from "../constants";

export const useTransfers = () => {

    const { themePlane } = storeToRefs(useThemeStore());
    const { selectedMonth, startDate, endDate, getTimezoneOffsetString } = useDateFilters();
    const { showConfirm, showError, showInfo, showLoading, showSuccess, close } = useNotifications();

    const pageSize = 10;
    const tz = getTimezoneOffsetString();

    const showForm = ref(false);
    const isLoading = ref(false);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const transfers = ref([]);
    const formattedAmount = ref('');
    const showPicker = ref(false);

    const form = reactive({
        fromAccountId: 0,
        toAccountId: 0,
        amount: 0,
        description: '',
        date: new Date()
    });

    const parseAmount = (value) => Number((value || '').replace(/\D/g, '') || 0);
    const formatDate = (value) => new Date(value).toLocaleString();

    const mapTransfer = (item) => ({
        ...item,
        amount: Number(item.amount ?? 0)
    });

    const handleAmountInput = (event) => {
        const amount = parseAmount(event.target.value);
        formattedAmount.value = amount ? formatoMoneda(amount) : '';
        form.amount = amount;
    };

    const resetForm = () => {
        form.fromAccountId = 0;
        form.toAccountId = 0;
        form.amount = 0;
        form.description = '';
        form.date = new Date();
        formattedAmount.value = '';
    };

    const fetchTransfers = async (page = 1) => {
        currentPage.value = page;
        isLoading.value = true;

        try {
            const { data } = await getTransfers({
                startDate: startDate.value,
                endDate: endDate.value,
                page,
                pageSize,
                tz
            });

            const list = Array.isArray(data)
                ? data
                : (data.transfers ?? data.rows ?? []);

            transfers.value = list.map(mapTransfer);
            totalPages.value = Number(data?.totalPages ?? 1);
        } catch (error) {
            console.error(error);
            showError('No se pudieron cargar las transferencias');
            transfers.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    const handleSubmit = async () => {
        if (!form.fromAccountId || !form.toAccountId) {
            showInfo('Selecciona cuenta origen y destino');
            return;
        }

        if (form.fromAccountId === form.toAccountId) {
            showInfo('La cuenta origen y destino deben ser diferentes');
            return;
        }

        if (!form.amount) {
            showInfo('Ingresa un monto válido');
            return;
        }

        const payload = {
            fromAccountId: form.fromAccountId,
            toAccountId: form.toAccountId,
            amount: form.amount,
            description: form.description,
            date: form.date ? new Date(form.date).toISOString() : null
        };

        showLoading('Guardando transferencia...');

        try {
            await createTransfer(payload);
            close();
            showSuccess('Transferencia creada correctamente');
            resetForm();
            showForm.value = false;
            await fetchTransfers(1);
        } catch (error) {
            close();
            console.error(error);
            showError('No se pudo crear la transferencia');
        }
    };

    const removeTransfer = async (id) => {
        const confirm = await showConfirm('¿Eliminar transferencia?', 'Eliminar', 'Cancelar');

        if (!confirm.isConfirmed) {
            return;
        }

        showLoading('Eliminando...');

        try {
            await deleteTransfer(id);
            close();
            showSuccess('Transferencia eliminada');
            await fetchTransfers(currentPage.value);
        } catch (error) {
            close();
            console.error(error);
            showError('No se pudo eliminar la transferencia');
        }
    };

    watch([startDate, endDate], () => fetchTransfers(1));

    onMounted(() => fetchTransfers());

    return {
        themePlane,
        selectedMonth,
        showForm,
        isLoading,
        currentPage,
        totalPages,
        transfers,
        formattedAmount,
        form,
        formatDate,
        handleAmountInput,
        handleSubmit,
        removeTransfer,
        showPicker
    };
}