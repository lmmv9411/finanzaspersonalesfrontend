<template>
    <div class="p-4 dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md mx-auto mt-6">
        <h2 class="text-xl font-semibold mb-4 dark:text-gray-100">Balance General Mes</h2>
        <div class="space-y-2">
            <p class="text-green-600">Ingresos: {{ formatCurrency(movementStore.balance.totalIngreso) }}</p>
            <p class="text-red-500">Gastos: {{ formatCurrency(movementStore.balance.totalGasto) }}</p>
            <p class="font-bold dark:text-gray-300">
                Balance:
                <span :class="movementStore.balance.balance >= 0 ? 'text-green-700' : 'text-red-700'">
                    {{ formatCurrency(movementStore.balance.balance) }}
                </span>
            </p>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMovementStore } from '../stores/movementStore'

const movementStore = useMovementStore();

onMounted(() => movementStore.fetchBalance())

const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(value)
}
</script>