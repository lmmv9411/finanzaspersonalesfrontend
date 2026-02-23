<template>
    <section class="px-4 py-5 max-w-3xl mx-auto dark:text-gray-100">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold">Cuentas</h2>
            <BaseButton @click="toggleForm" class="flex items-center gap-2">
                <PlusIcon class="w-5 h-5" />
                <span>{{ showForm ? 'Cerrar' : 'Nueva cuenta' }}</span>
            </BaseButton>
        </div>

        <Transition name="slide-cuenta">
            <form
                v-if="showForm"
                @submit.prevent="handleSubmit"
                class="mb-6 p-4 rounded-lg shadow bg-slate-100 dark:bg-gray-800 space-y-3"
            >
                <div>
                    <label class="block mb-1 text-sm">Nombre</label>
                    <BaseInput v-model.trim="form.name" required placeholder="Ej: Bancolombia" />
                </div>

                <div>
                    <label class="block mb-1 text-sm">Saldo inicial</label>
                    <BaseInput v-model="formattedAmount" @input="handleAmountInput" type="tel" placeholder="$0" />
                </div>

                <div class="flex items-center gap-2 justify-end">
                    <BaseButton color="danger" type="button" @click="resetForm">
                        <ArrowPathIcon class="w-5 h-5" />
                    </BaseButton>
                    <BaseButton type="submit" class="flex items-center gap-2">
                        <span>{{ isEdit ? 'Actualizar' : 'Guardar' }}</span>
                        <PencilSquareIcon v-if="isEdit" class="w-5 h-5" />
                        <CheckCircleIcon v-else class="w-5 h-5" />
                    </BaseButton>
                </div>
            </form>
        </Transition>

        <div class="grid sm:grid-cols-2 gap-3">
            <article
                v-for="account in accounts"
                :key="account.id"
                class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm bg-white dark:bg-gray-900"
            >
                <div class="flex justify-between items-start gap-2">
                    <div>
                        <h3 class="font-semibold text-lg">{{ account.name }}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Saldo: {{ formatoMoneda(account.currentBalance) }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Gastos: {{ formatoMoneda(account.totalGasto) }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Ingresos: {{ formatoMoneda(account.totalIngreso) }}</p>
                    </div>
                    <div class="flex gap-1">
                        <button @click="startEdit(account)" title="Editar" class="text-blue-500 hover:text-blue-600 cursor-pointer">
                            <PencilSquareIcon class="w-5 h-5" />
                        </button>
                        <button @click="removeAccount(account.id)" title="Eliminar" class="text-red-500 hover:text-red-600 cursor-pointer">
                            <TrashIcon class="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </article>
        </div>

        <p v-if="!accounts.length" class="text-gray-500 dark:text-gray-400 text-sm">No tienes cuentas registradas.</p>
    </section>
</template>

<script setup>
import { ArrowPathIcon, CheckCircleIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { onMounted, reactive, ref } from 'vue';
import { createAccount, deleteAccount, getAccounts, updateAccount } from '../api/accounts';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import { formatoMoneda } from '../constants';
import { useNotifications } from '../composables/useNotifications';

const { showConfirm, showError, showInfo, showLoading, showSuccess, close } = useNotifications();

const accounts = ref([]);
const showForm = ref(false);
const isEdit = ref(false);
const formattedAmount = ref('');
const form = reactive({
    id: null,
    name: '',
    initialBalance: 0
});

const parseAmount = (value) => Number((value || '').replace(/\D/g, '') || 0);


const fetchAccounts = async () => {
    try {
        const { data } = await getAccounts();
        const list = Array.isArray(data) ? data : (data.accounts ?? []);
        accounts.value = list;
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
    form.id = null;
    form.name = '';
    form.initialBalance = 0;
    formattedAmount.value = '';
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
        initialBalance: form.initialBalance
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
    form.id = account.id;
    form.name = account.name;
    form.initialBalance = Number(account.balance ?? 0);
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

onMounted(fetchAccounts);
</script>

<style scoped>
.slide-cuenta-enter-active,
.slide-cuenta-leave-active {
    transition: all 0.25s ease;
}

.slide-cuenta-enter-from,
.slide-cuenta-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
