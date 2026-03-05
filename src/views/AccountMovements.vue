<template>
    <div class="container mx-auto max-w-3xl py-4 px-2">
        <div class="flex items-center justify-between mb-4">
            <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <span class="rounded-full p-1 text-2xl text-white bg-indigo-500"
                          :class="getRandomBgColor(account.type)"
                          v-if="account.type">
                        <Icon :icon="account.type" />
                    </span>
                    {{ account.name || `Cuenta #${accountId}` }}
                </p>
            </div>
            <BaseButton color="secondary" @click="router.back()">Volver</BaseButton>
        </div>

        <div class="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mes:</label>
            <VueDatePicker
                           month-picker
                           v-model="selectedMonth"
                           format="MMMM yyyy"
                           :dark="themePlane === 'dark'"
                           :format-locale="es" />
        </div>

        <div class="mb-6 p-2 sm:p-3 dark:bg-gray-800 bg-blue-50 rounded-lg">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                <div class="rounded-lg bg-white/90 dark:bg-gray-900 p-2 sm:p-3 text-center">
                    <span class="text-[11px] sm:text-xs text-cyan-700 dark:text-cyan-300 font-semibold block">
                        Saldo Actual
                    </span>
                    <span class="text-sm sm:text-base font-bold text-cyan-700 dark:text-cyan-300 break-words">{{
                        formatoMoneda(account.currentBalance) }}</span>
                </div>

                <div class="rounded-lg bg-white/90 dark:bg-gray-900 p-2 sm:p-3 text-center">
                    <span
                          class="text-[11px] sm:text-xs text-green-600 dark:text-green-400 font-semibold block">Ingresos</span>
                    <span class="text-sm sm:text-base font-bold text-green-600 dark:text-green-400 break-words">{{
                        formatoMoneda(totalIngreso) }}</span>
                </div>

                <div class="rounded-lg bg-white/90 dark:bg-gray-900 p-2 sm:p-3 text-center">
                    <span
                          class="text-[11px] sm:text-xs text-red-600 dark:text-red-400 font-semibold block">Gastos</span>
                    <span class="text-sm sm:text-base font-bold text-red-600 dark:text-red-400 break-words">{{
                        formatoMoneda(totalGasto) }}</span>
                </div>

                <div class="rounded-lg bg-white/90 dark:bg-gray-900 p-2 sm:p-3 text-center">
                    <span
                          class="text-[11px] sm:text-xs text-indigo-700 dark:text-indigo-200 font-semibold block">Saldo
                        Mes</span>
                    <span class="text-sm sm:text-base font-bold text-indigo-700 dark:text-indigo-200 break-words">{{
                        formatoMoneda(balance) }}</span>
                </div>
            </div>
        </div>

        <div v-if="isLoading" class="min-h-[200px] flex items-center justify-center">
            <span class="text-gray-600 dark:text-gray-300">Cargando movimientos...</span>
        </div>

        <div v-else-if="movements.length === 0" class="text-center py-8 text-gray-500">
            No hay movimientos para esta cuenta en este período
        </div>

        <div v-else>
            <div
                 v-for="dia in movements"
                 :key="dia.fecha_server"
                 class="mb-6">

                <div class="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
                    <h3 class="text-xs sm:text-base dark:text-gray-200">
                        {{ dia.nombreDia }}, {{ dia.dia }} de {{ dia.mes }}
                    </h3>
                    <div class="flex gap-2 text-xs sm:text-base">
                        <span v-if="dia.ingresos > 0" class="text-green-600 dark:text-green-400">{{
                            formatoMoneda(dia.ingresos) }}</span>
                        <span v-if="dia.gastos > 0" class="text-red-600 dark:text-red-400">{{
                            formatoMoneda(dia.gastos)
                            }}</span>
                    </div>
                </div>

                <div
                     class="border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden divide-y divide-gray-200 dark:divide-gray-700">
                    <div v-for="mov in dia.detalles" :key="mov.id"
                         class="p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div class="flex justify-between items-center">
                            <div class="flex flex-col gap-3">
                                <div class="flex gap-3 items-center">
                                    <div class="text-sm text-gray-500 mt-1">
                                        <ArrowsRightLeftIcon v-if="mov.isTransfer" class="w-6 text-indigo-500" />
                                        <ArrowTrendingUpIcon v-else-if="mov.type === 'ingreso'"
                                                             class="w-6 text-green-500" />
                                        <ArrowTrendingDownIcon v-else class="w-6 text-red-500" />
                                    </div>
                                    <p class="font-medium dark:text-gray-100">{{ mov.description }}</p>
                                </div>


                                <div v-if="mov.isTransfer"
                                     class="flex gap-2 items-center text-sm text-gray-500 dark:text-gray-400">

                                    <div :class=[getRandomBgColor(mov.Transfer?.fromAccount?.type)]
                                         class="rounded-full p-1 text-white text-lg">
                                        <Icon :icon="mov.Transfer?.fromAccount?.type" />
                                    </div>

                                    <span>{{ mov.Transfer?.fromAccount?.name }}</span>

                                    <ArrowTrendingUpIcon v-if="mov.type === 'ingreso'" class="w-6 text-green-500" />
                                    <ArrowTrendingDownIcon v-else class="w-6 text-red-500" />

                                    <div :class=[getRandomBgColor(mov.Transfer?.toAccount?.type)]
                                         class="rounded-full p-1 text-white text-lg">
                                        <Icon :icon="mov.Transfer?.toAccount?.type" />
                                    </div>
                                    <span>{{ mov.Transfer?.toAccount?.name }}</span>
                                    <span>•</span>
                                    <span>Transferencia</span>
                                </div>

                                <div v-else
                                     class="flex gap-2 items-center text-sm text-gray-500 dark:text-gray-400">
                                    <div :class=[getRandomBgColor(account.type)]
                                         class="rounded-full p-1 text-white text-lg">
                                        <Icon :icon="account.type" />
                                    </div>
                                    <span>{{ account.name }}</span>
                                    <span>•</span>
                                    <span>{{ mov.type }}</span>

                                </div>

                            </div>

                            <span v-if="mov.isTransfer"
                                  class="text-blue-600 dark:text-blue-400">
                                {{ formatoMoneda(mov.amount) }}
                            </span>
                            <span v-else-if="mov.type === 'ingreso'"
                                  class="text-green-600 dark:text-green-400">
                                {{ formatoMoneda(mov.amount) }}
                            </span>
                            <span v-else class="text-red-600 dark:text-red-400">
                                {{ formatoMoneda(mov.amount) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Pagination
                    v-if="totalPages > 1"
                    :currentPage="currentPage"
                    :totalPages="totalPages"
                    @page-changed="fetchMovements" />
    </div>
</template>

<script setup>
import { ArrowsRightLeftIcon, ArrowTrendingDownIcon, ArrowTrendingUpIcon } from '@heroicons/vue/24/solid';
import { Icon } from '@iconify/vue';
import { es } from 'date-fns/locale';
import Pagination from '../components/Pagination.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import { formatoMoneda } from '../constants';
import { getRandomBgColor } from './configs/icons';
import { useAccountsMovements } from '../composables/useAccountsMovements';

const {
    account,
    movements,
    totalIngreso,
    totalGasto,
    balance,
    isLoading,
    currentPage,
    totalPages,
    selectedMonth,
    themePlane,
    fetchMovements,
    accountId,
    router
} = useAccountsMovements();

</script>
