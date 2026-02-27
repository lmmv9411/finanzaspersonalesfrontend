<template>
    <section class="px-4 py-5 max-w-4xl mx-auto dark:text-gray-100">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold">Transferencias</h2>
            <BaseButton @click="showForm = !showForm" class="flex items-center gap-2">
                <PlusIcon class="w-5 h-5" />
                <span class="hidden sm:block">{{ showForm ? 'Cerrar' : 'Nueva transferencia' }}</span>
            </BaseButton>
        </div>

        <Transition name="slide-transfer">
            <form v-if="showForm" @submit.prevent="handleSubmit"
                  class="mb-6 p-4 rounded-lg shadow bg-slate-100 dark:bg-gray-800 space-y-3">
                <div class="grid sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block mb-1 text-sm">Cuenta origen</label>
                        <AccountSelect v-model="form.fromAccountId" />
                    </div>
                    <div>
                        <label class="block mb-1 text-sm">Cuenta destino</label>
                        <AccountSelect v-model="form.toAccountId" />
                    </div>
                </div>

                <div class="grid sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block mb-1 text-sm">Monto</label>
                        <BaseInput v-model="formattedAmount" @input="handleAmountInput" type="tel" placeholder="$0" />
                    </div>
                    <div>
                        <label class="block mb-1 text-sm">Fecha</label>
                        <VueDatePicker
                                       :dark="themePlane === 'dark'"
                                       v-model="form.date"
                                       format="EEEE, dd MMM yyyy hh:mm a"
                                       :format-locale="es" />
                    </div>
                </div>

                <div>
                    <label class="block mb-1 text-sm">Descripción</label>
                    <BaseInput v-model.trim="form.description" placeholder="Ej: paso de ahorros a gastos" />
                </div>

                <div class="flex items-center gap-2 justify-end">
                    <BaseButton color="danger" type="button" @click="resetForm">
                        <ArrowPathIcon class="w-5 h-5" />
                    </BaseButton>
                    <BaseButton type="submit" class="flex items-center gap-2">
                        <CheckCircleIcon class="w-5 h-5" />
                        <span>Guardar</span>
                    </BaseButton>
                </div>
            </form>
        </Transition>

        <div class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mes:</label>
            <VueDatePicker
                           month-picker
                           v-model="selectedMonth"
                           format="MMMM yyyy"
                           :dark="themePlane === 'dark'"
                           :format-locale="es" />
        </div>

        <div v-if="isLoading" class="py-8 text-center text-gray-500">Cargando transferencias...</div>
        <div v-else-if="!transfers.length" class="py-8 text-center text-gray-500">No hay transferencias para este
            período.</div>

        <div v-else class="space-y-3">
            <article
                     v-for="transfer in transfers"
                     :key="transfer.id"
                     class="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <p class="font-semibold text-sm sm:text-base">
                            {{ transfer.fromAccount?.name || transfer.fromAccountName || 'Cuenta origen' }}
                            <span class="text-gray-400">→</span>
                            {{ transfer.toAccount?.name || transfer.toAccountName || 'Cuenta destino' }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ transfer.description || 'Sin descripción'
                            }}</p>
                        <p class="text-xs text-gray-400 mt-1">{{ formatDate(transfer.date) }}</p>
                    </div>

                    <div class="text-right">
                        <p class="font-bold text-indigo-600 dark:text-indigo-300">{{ formatoMoneda(transfer.amount) }}
                        </p>
                        <button
                                @click="removeTransfer(transfer.id)"
                                class="text-red-500 hover:text-red-600 text-sm cursor-pointer mt-1">
                            Eliminar
                        </button>
                    </div>
                </div>
            </article>

            <Pagination
                        v-if="totalPages > 1"
                        :currentPage="currentPage"
                        :totalPages="totalPages"
                        @page-changed="fetchTransfers" />
        </div>
    </section>
</template>

<script setup>
import { ArrowPathIcon, CheckCircleIcon, PlusIcon } from '@heroicons/vue/24/solid';
import { es } from 'date-fns/locale';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref, watch } from 'vue';
import { createTransfer, deleteTransfer, getTransfers } from '../api/transfers';
import AccountSelect from '../components/AccountSelect.vue';
import Pagination from '../components/Pagination.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import { useDateFilters } from '../composables/useDates';
import { useNotifications } from '../composables/useNotifications';
import { useThemeStore } from '../composables/useTheme';
import { formatoMoneda } from '../constants';

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
</script>

<style scoped>
.slide-transfer-enter-active,
.slide-transfer-leave-active {
    transition: all 0.25s ease;
}

.slide-transfer-enter-from,
.slide-transfer-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
