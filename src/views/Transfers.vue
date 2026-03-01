<template>
    <section class="px-4 py-5 max-w-4xl mx-auto dark:text-gray-100">

        <div class="flex justify-between items-center mb-4">

            <BaseButton @click="showForm = !showForm" class="flex items-center gap-2 ml-auto"
                        :color="showForm ? 'danger' : ''">
                <XMarkIcon v-if="showForm" class="w-5 h-5" />
                <PlusIcon v-else class="w-5 h-5" />
                <span>{{ showForm ? 'Cerrar' : 'Nueva transferencia' }}</span>
            </BaseButton>
        </div>

        <Transition name="slide-transfer">
            <form v-if="showForm" @submit.prevent="handleSubmit"
                  class="mb-6 p-4 rounded-lg shadow bg-slate-100 dark:bg-gray-800 space-y-3">
                <div class="grid sm:grid-cols-2 gap-3">

                    <Transition name="slide-date">

                        <div v-if="showPicker" class="w-full">
                            <label class="block mb-1 text-sm">Fecha</label>
                            <VueDatePicker
                                           :dark="themePlane === 'dark'"
                                           v-model="form.date"
                                           format="EEEE, dd MMM yyyy hh:mm a"
                                           :format-locale="es" />
                        </div>

                    </Transition>

                    <div class="sm:col-span-2 grid sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block mb-1 text-sm">Cuenta origen</label>
                            <AccountSelect v-model="form.fromAccountId" />
                        </div>

                        <div>
                            <label class="block mb-1 text-sm">Cuenta destino</label>
                            <AccountSelect v-model="form.toAccountId" />
                        </div>
                    </div>

                    <div>
                        <label class="block mb-1 text-sm">Monto</label>
                        <BaseInput v-model="formattedAmount" @input="handleAmountInput" type="tel"
                                   placeholder="$0" />
                    </div>

                    <div>
                        <label class="block mb-1 text-sm">Descripción</label>
                        <BaseInput v-model.trim="form.description" placeholder="Ej: paso de ahorros a gastos" />
                    </div>

                    <div class="flex items-center gap-2 justify-start items-center">
                        <BaseButton color="danger" type="button" @click="resetForm">
                            <ArrowPathIcon class="w-5 h-5" />
                        </BaseButton>
                        <BaseButton type="submit" class="flex items-center gap-2">
                            <CheckCircleIcon class="w-5 h-5" />
                            <span>Guardar</span>
                        </BaseButton>

                        <div class="ml-auto sm:ml-0">
                            <button type="button" class="cursor-pointer" @click="showPicker = !showPicker">
                                <CalendarDaysIcon class="w-8 h-8"
                                                  :class="{ 'text-indigo-500': showPicker, 'text-green-700': !showPicker }" />
                            </button>
                        </div>

                    </div>
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
                            <TrashIcon class="w-5 h-5" />
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
import { ArrowPathIcon, CalendarDaysIcon, CheckCircleIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { es } from 'date-fns/locale';
import AccountSelect from '../components/AccountSelect.vue';
import Pagination from '../components/Pagination.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import { formatoMoneda } from '../constants';
import { useTransfers } from '../composables/useTransfers';

const {
    themePlane,
    selectedMonth,
    transfers,
    isLoading,
    totalPages,
    currentPage,
    form,
    showForm,
    formatDate,
    handleSubmit,
    handleAmountInput,
    resetForm,
    removeTransfer,
    formattedAmount,
    showPicker
} = useTransfers();

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

.slide-date-enter-active,
.slide-date-leave-active {
    transition: all 0.25s ease;
}

.slide-date-enter-from,
.slide-date-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
