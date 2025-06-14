<template>

    <div class="grid gap-4 grid-cols-2 sm:grid-cols-5 sm:items-start">

        <div
             class="col-span-full sm:col-span-2 w-full p-4 dark:bg-gray-800 bg-slate-100 rounded-lg shadow-md max-w-md mx-auto">
            <div class="flex gap-2 items-center">
                <span class="font-semibold dark:text-gray-200">Mes</span>
                <BaseInput type="month" v-model="balanceStore.selectedMonth" />
            </div>
        </div>

        <div class="w-full p-4 dark:bg-gray-800 bg-slate-100 rounded-lg shadow-md max-w-md mx-auto">
            <div class="flex flex-col gap-2 items-center dark:text-green-400 text-green-500 text-xl font-semibold">
                <div class="flex gap-2">
                    <ArrowTrendingUpIcon class="w-8 inline-block" />
                    <span>Ingresos</span>
                </div>
                <span>{{ formatoMoneda(balanceStore.balance.totalIngreso) }}</span>
            </div>
        </div>

        <div class="w-full p-4 dark:bg-gray-800 bg-slate-100 rounded-lg shadow-md max-w-md mx-auto">
            <div class="flex flex-col gap-2 items-center dark:text-red-400 text-red-500 text-xl font-semibold">
                <div class="flex gap-2">
                    <ArrowTrendingDownIcon class="w-8 inline-block" />
                    <span>Gastos</span>
                </div>
                <span>{{ formatoMoneda(balanceStore.balance.totalGasto) }}</span>
            </div>
        </div>

        <div
             class="col-span-full sm:col-span-1 w-full p-4 dark:bg-gray-800 bg-slate-100 rounded-lg shadow-md max-w-md mx-auto">
            <div class="flex flex-col items-center gap-2 dark:text-indigo-300 text-indigo-500 text-xl font-semibold">
                <div class="flex gap-2">
                    <CurrencyDollarIcon class="w-8 dark:text-indigo-300 text-indigo-500" />
                    <span>Saldo</span>
                </div>
                <span
                      :class="balanceStore.balance.balance >= 0 ? 'text-indigo-500 dark:text-indigo-300' : 'text-red-500 dark:text-red-300'">
                    {{ formatoMoneda(balanceStore.balance.balance) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, CurrencyDollarIcon } from '@heroicons/vue/24/solid';
import { onMounted } from 'vue';
import { useBalanceStore } from '../stores/balanceStore';
import BaseInput from './ui/BaseInput.vue';
import { formatoMoneda } from '../constants';

const balanceStore = useBalanceStore();

onMounted(() => balanceStore.fetchBalance());

</script>