<template>
    <div
         class="mt-4 max-w-xl mx-4 sm:mx-auto p-4 rounded-lg shadow-lg bg-slate-100  dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">

        <h2 class="text-2xl text-center font-semibold mb-4">{{ isEdit ? 'Editar' : 'Registrar' }} Movimiento</h2>

        <form @submit.prevent="submitForm(isEdit)" class="flex flex-col gap-4 items-end" autocomplete="off">

            <Transition name="slide-date">
                <div v-if="showPicker" class="w-full">
                    <VueDatePicker
                                   :dark="themePlane === 'dark'"
                                   v-model="movement.date"
                                   format="EEEE, dd MMM yyyy hh:mm a"
                                   :format-locale="es" />
                </div>
            </Transition>



            <div class="w-full flex justify-between gap-4">
                <RadioButton v-model="movement.type" :options="options" />
                <button type="button" class="cursor-pointer" @click="showPicker = !showPicker">
                    <CalendarDaysIcon class="w-8 h-8"
                                      :class="{ 'text-indigo-500': showPicker, 'text-green-700': !showPicker }" />
                </button>
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
import { ArrowDownIcon, ArrowPathIcon, ArrowsRightLeftIcon, ArrowUpIcon, CalendarDaysIcon } from '@heroicons/vue/24/solid';
import VueDatePicker from '@vuepic/vue-datepicker';
import { es } from 'date-fns/locale';
import { storeToRefs } from 'pinia';
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import CategorySelect from '../components/CategorySelect.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import RadioButton from '../components/ui/RadioButton.vue';
import { useMovement } from '../composables/movement';
import { useThemeStore } from '../composables/useTheme';

const { themePlane } = storeToRefs(useThemeStore());

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
    resetForm,
} = useMovement();

const { movement, showPicker } = storeToRefs(movementStore)

watchEffect(() => {

    const data = JSON.parse(sessionStorage.getItem('data'))

    if (isEdit && data) {

        sessionStorage.removeItem('data')
        showPicker.value = true

        movement.value = { ...data, date: new Date(data.date) }

        valor.value = formatoMoneda(data.amount)
    }

    if (showPicker.value && !isEdit) {
        movement.value.date = new Date()
    }

})

</script>

<style scoped>
.slide-date-enter-active,
.slide-date-leave-active {
    transition: all 0.3s ease;
}

.slide-date-enter-from,
.slide-date-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
