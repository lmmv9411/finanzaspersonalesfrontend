<template>
    <div class="p-4 dark:bg-gray-800 bg-slate-100 rounded-lg shadow-md w-full max-w-md mx-auto mt-6a">
        <h2 class="text-xl font-semibold mb-4 dark:text-gray-300 text-gray-600">Balance General Mes</h2>
        <div class="space-y-2">
            <BaseInput type="month" v-model="balanceStore.selectedMonth" />
            <p class="dark:text-green-400 text-green-500 flex gap-2 text-xl">
                <ArrowTrendingUpIcon class="w-5 inline-block" />
                <span>Ingresos</span>
                <span>{{ formatoMoneda(balanceStore.balance.totalIngreso) }}</span>
            </p>
            <p class="dark:text-red-400 text-red-500 flex gap-2 text-xl">
                <ArrowTrendingDownIcon class="w-5 inline-block" />
                <span>Gastos</span>
                <span>{{ formatoMoneda(balanceStore.balance.totalGasto) }}</span>
            </p>
            <p class="dark:text-indigo-300 text-indigo-500 flex gap-2 text-xl">

                <CurrencyDollarIcon class="w-6 dark:text-indigo-300 text-indigo-500" />

                <span>Saldo</span>
                <span
                      :class="balanceStore.balance.balance >= 0 ? 'text-indigo-500 dark:text-indigo-300' : 'text-red-500 dark:text-red-300'">
                    {{ formatoMoneda(balanceStore.balance.balance) }}
                </span>
            </p>
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