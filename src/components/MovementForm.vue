<template>
    <div
         class="mx-auto p-4 border border-gray-300 rounded-lg shadow-lg bg-slate-100  dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">

        <h2 class="text-2xl font-semibold mb-4">{{ isEdit ? 'Editar' : 'Registrar' }} Movimiento</h2>

        <form @submit.prevent="submitForm(isEdit)" class="flex flex-col gap-4 items-end" autocomplete="off">

            <div v-show="isEdit" class="flex flex-col w-full">
                <label for="createdAt">Fecha</label>
                <BaseInput id="createdAt" type="datetime-local" v-model="movement.date" />
            </div>

            <div class="w-full flex gap-4">

                <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input
                           id="ingreso"
                           type="radio"
                           value="ingreso"
                           v-model="movement.type"
                           class="form-radio h-5 w-5" />

                    <span>Ingreso</span>

                </label>
                <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input
                           id="gasto"
                           type="radio"
                           value="gasto"
                           v-model="movement.type"
                           class="form-radio h-5 w-5" />

                    <span>Gasto</span>

                </label>

            </div>

            <div class="w-full">
                <label for="category" class="block text-gray-700 dark:text-gray-300">Categoría</label>
                <BaseSelect id="category" v-model="movement.CategoryId">
                    <option value="" disabled>Selecciona una categoría</option>
                    <option v-for="category in categoriesStore.categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </BaseSelect>
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
                <BaseInput id="description" v-model.trim="movement.description" />
            </div>

            <div class="flex gap-2">
                <BaseButton type="submit" class="flex gap-2 items-center">
                    <span>{{ isEdit ? 'Editar' : 'Crear' }} Movimiento</span>
                    <ArrowsRightLeftIcon class="w-5 inline" />
                </BaseButton>
                <BaseButton color="danger" @click="modalStore.isRendered = false">
                    <span>Cerrar</span>
                </BaseButton>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ArrowsRightLeftIcon } from '@heroicons/vue/16/solid';
import { watchEffect } from 'vue';
import { useMovementform } from '../composables/movementForm';
import { useCategorieStore } from '../stores/categoriesStore';
import BaseButton from './ui/BaseButton.vue';
import BaseInput from './ui/BaseInput.vue';
import BaseSelect from './ui/BaseSelect.vue';

const { isEdit = false, data } = defineProps(['isEdit', 'data']);

const {
    handleInput,
    formatoMoneda,
    movement,
    submitForm,
    valor,
    modalStore
} = useMovementform();

const categoriesStore = useCategorieStore()

watchEffect(async () => {

    if (isEdit && data) {

        const date = new Date(data.date);

        const pad = n => n.toString().padStart(2, '0');
        const localDateTime = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

        movement.value = { ...data, date: localDateTime }

        valor.value = formatoMoneda(data.amount)

        await useCategorieStore().getCategories()

    }

})

</script>
