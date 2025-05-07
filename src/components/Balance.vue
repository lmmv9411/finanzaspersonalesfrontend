<template>
    <div class="p-4 dark:bg-slate-800 bg-slate-100 rounded-lg shadow-md w-full max-w-md mx-auto mt-6a">
        <h2 class="text-xl font-semibold mb-4 dark:text-gray-300">Balance General Mes</h2>
        <div class="space-y-2">
            <input
                   type="month"
                   class="dark:text-gray-300 p-2 w-fit border border-gray-300 dark:bg-gray-900 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-300 rounded"
                   v-model="balanceStore.selectedMonth"
                   @change="balanceStore.pick" />
            <p class="text-green-600">Ingresos: {{ balanceStore.formatCurrency(balanceStore.balance.totalIngreso) }}
            </p>
            <p class="text-red-500">Gastos: {{ balanceStore.formatCurrency(balanceStore.balance.totalGasto) }}</p>
            <p class="font-bold dark:text-gray-300">
                Balance:
                <span :class="balanceStore.balance.balance >= 0 ? 'text-green-700' : 'text-red-700'">
                    {{ balanceStore.formatCurrency(balanceStore.balance.balance) }}
                </span>
            </p>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useBalanceStore } from '../stores/balanceStore';

const balanceStore = useBalanceStore();

onMounted(() => balanceStore.fetchBalance());

</script>