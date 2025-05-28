<template>
    <div class="p-4 dark:bg-gray-800 bg-slate-100 rounded-lg shadow-md w-full max-w-md mx-auto mt-6a">
        <h2 class="text-xl font-semibold mb-4 dark:text-gray-300">Balance General Mes</h2>
        <div class="space-y-2">
            <input
                   type="month"
                   class="dark:text-gray-300 p-2 w-fit border border-gray-300 dark:bg-gray-900 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-300 rounded"
                   v-model="balanceStore.selectedMonth" />
            <p class="text-green-600 flex gap-2">
                <ArrowTrendingUpIcon class="w-5 inline-block" />
                <span>Ingresos</span>
                <span>{{ balanceStore.formatCurrency(balanceStore.balance.totalIngreso) }}</span>
            </p>
            <p class="text-red-600 flex gap-2">
                <ArrowTrendingDownIcon class="w-5 inline-block" />
                <span>Gastos</span>
                <span>{{ balanceStore.formatCurrency(balanceStore.balance.totalGasto) }}</span>
            </p>
            <p class="dark:text-gray-400 text-gray-700 flex gap-2">
                <ScaleIcon class="w-5 inline-block" />
                <span>Balance</span>
                <span :class="balanceStore.balance.balance >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ balanceStore.formatCurrency(balanceStore.balance.balance) }}
                </span>
            </p>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useBalanceStore } from '../stores/balanceStore';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ScaleIcon } from '@heroicons/vue/24/solid'

const balanceStore = useBalanceStore();

onMounted(() => balanceStore.fetchBalance());

</script>