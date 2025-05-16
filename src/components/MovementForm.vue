<template>
    <div
         class="mx-auto p-4 border border-gray-300 rounded-lg shadow-lg bg-slate-100  dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">

        <h2 class="text-2xl font-semibold mb-4">Registrar Movimiento</h2>

        <form @submit.prevent="submitForm" class="flex flex-col gap-4 items-end" autocomplete="off">

            <div class="w-full">
                <label for="type" class="block text-gray-700 dark:text-gray-300">Tipo de Movimiento</label>
                <select
                        id="type"
                        v-model="movement.type"
                        class="p-2 w-full border border-gray-300 dark:bg-gray-900 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-300 rounded">
                    <option value="ingreso">Ingreso</option>
                    <option value="gasto">Gasto</option>
                </select>
            </div>

            <div class="w-full">
                <label for="amount" class="block text-gray-700 dark:text-gray-300">Monto</label>
                <input
                       type="tel"
                       id="amount"
                       v-model="valor"
                       @input="formatearComoMoneda"
                       class="p-2 border border-gray-300 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-300 rounded w-full"
                       required />
            </div>

            <div class="w-full">
                <label for="description" class="block text-gray-700 dark:text-gray-300">Descripción</label>
                <input
                       type="text"
                       id="description"
                       v-model="movement.description"
                       class="p-2 border border-gray-300 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-300 rounded w-full" />
            </div>

            <div class="w-full">
                <label for="category" class="block text-gray-700 dark:text-gray-300">Categoría</label>
                <select
                        id="category"
                        v-model="movement.CategoryId"
                        class="p-2 border border-gray-300 dark:bg-gray-900 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-300 rounded w-full">
                    <option value="" disabled>Selecciona una categoría</option>
                    <option v-for="category in movementStore.categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
            </div>

            <button type="submit" class="w-full sm:w-auto p-2 bg-blue-500 text-white rounded cursor-pointer">
                Registrar Movimiento
            </button>
            <button @click="modalStore.isRendered = false" type="button"
                    class="w-full sm:w-auto p-2 bg-red-500 text-white rounded cursor-pointer">
                Cerrar
            </button>
        </form>
    </div>
</template>

<script setup>
import { watchEffect } from 'vue';
import { useMovementform } from '../composables/movementForm';

const { isEdit = false, data } = defineProps(['isEdit', 'data']);

const {
    formatearComoMoneda,
    movement,
    submitForm,
    valor,
    movementStore,
    modalStore
} = useMovementform();

watchEffect(() => {
    if (isEdit && data) {

        movement.value = {
            type: data.type,
            CategoryId: data.CategoryId,
            amount: data.amount,
            description: data.description
        }

        formatearComoMoneda(data.amount, false)

    }
})

</script>
