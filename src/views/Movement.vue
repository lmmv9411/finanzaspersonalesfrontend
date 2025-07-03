<template>
    <div
         class="max-w-xl mx-auto p-4 rounded-lg shadow-lg bg-slate-100  dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">

        <h2 class="text-2xl font-semibold mb-4">{{ isEdit ? 'Editar' : 'Registrar' }} Movimiento</h2>

        <form @submit.prevent="submitForm(isEdit)" class="flex flex-col gap-4 items-end" autocomplete="off">

            <div v-show="isEdit" class="flex flex-col w-full">
                <label for="createdAt">Fecha</label>
                <BaseInput id="createdAt" type="datetime-local" v-model="movement.date" />
            </div>

            <div class="w-full flex gap-4">
                <RadioButton v-model="movement.type" :options="options" />
            </div>

            <div class="w-full">
                <CategorySelect v-model="movement.CategoryId" :type="movement.type" />
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
                <BaseInput id="description" v-model="movement.description" />
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
import { storeToRefs } from 'pinia';
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import CategorySelect from '../components/CategorySelect.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import RadioButton from '../components/ui/RadioButton.vue';
import { useMovement } from '../composables/movement';
import { useDateFilters } from '../composables/useDates';

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

const { movement } = storeToRefs(movementStore)

const { toLocalDateTime } = useDateFilters()

watchEffect(async () => {

    const data = JSON.parse(sessionStorage.getItem('data'))

    if (isEdit && data) {

        sessionStorage.removeItem('data')

        const localDateTime = toLocalDateTime(data.date);

        movement.value = { ...data, date: localDateTime }

        valor.value = formatoMoneda(data.amount)
    }

})

</script>
