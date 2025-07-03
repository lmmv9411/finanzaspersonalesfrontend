<template>
    <div
         class="max-w-xl mx-auto p-4 rounded-lg shadow-lg bg-slate-100  dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">

        <h2 class="text-2xl font-semibold mb-4">{{ isEdit ? 'Editar' : 'Registrar' }} Movimiento</h2>

        <form @submit.prevent="submitForm(isEdit)" class="flex flex-col gap-4 items-end" autocomplete="off">

            <div v-show="isEdit" class="flex flex-col w-full">
                <label for="createdAt">Fecha</label>
                <BaseInput id="createdAt" type="datetime-local" v-model="movementStore.movement.date" />
            </div>

            <div class="w-full flex gap-4">
                <RadioButton v-model="movementStore.movement.type" :options="options" />
            </div>

            <div class="w-full">
                <CategorySelect v-model="movementStore.movement.CategoryId" :type="movementStore.movement.type" />
            </div>

            <div class="w-full">
                <label for="amount" class="block text-gray-700 dark:text-gray-300">Monto</label>
                <BaseInput type="tel"
                           id="amount"
                           v-model="valor"
                           required
                           @input="handleInput" />
            </div>

            <div class="w-full">
                <label for="description" class="block text-gray-700 dark:text-gray-300">Descripción</label>
                <BaseInput id="description" v-model="movementStore.movement.description" />
            </div>

            <div class="flex gap-2">
                <BaseButton type="submit" class="flex gap-2 items-center">
                    <span>{{ isEdit ? 'Editar' : 'Crear' }} Movimiento</span>
                    <ArrowsRightLeftIcon class="w-5 inline" />
                </BaseButton>
                <BaseButton color="danger" @click="resetForm" title="Limpiar Formulario">
                    <ArrowPathIcon class="w-5 h-5" />
                </BaseButton>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ArrowsRightLeftIcon } from '@heroicons/vue/16/solid';
import { ArrowPathIcon } from '@heroicons/vue/20/solid';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/24/solid';
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import CategorySelect from '../components/CategorySelect.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import RadioButton from '../components/ui/RadioButton.vue';
import { useMovement } from '../composables/movement';

const route = useRoute()

const { isEdit = false } = route.query

const options = [
    {
        value: 'ingreso',
        label: 'Ingreso',
        color: 'green',
        icon: ArrowDownIcon
    },
    {
        value: 'gasto',
        label: 'Gasto',
        color: 'red',
        icon: ArrowUpIcon
    }
];

const {
    handleInput,
    formatoMoneda,
    movementStore,
    submitForm,
    valor,
    resetForm
} = useMovement();

watchEffect(async () => {

    const data = JSON.parse(sessionStorage.getItem('data'))

    if (isEdit && data) {

        sessionStorage.removeItem('data')

        const date = new Date(data.date);

        const pad = n => n.toString().padStart(2, '0');

        const year = date.getFullYear()
        const month = pad(date.getMonth() + 1)
        const day = pad(date.getDate())
        const hours = pad(date.getHours())
        const minutes = pad(date.getMinutes())

        const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

        movementStore.movement = { ...data, date: localDateTime }

        valor.value = formatoMoneda(data.amount)
    }

})

</script>
