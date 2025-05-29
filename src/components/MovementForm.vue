<template>
    <div
         class="mx-auto p-4 border border-gray-300 rounded-lg shadow-lg bg-slate-100  dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">

        <h2 class="text-2xl font-semibold mb-4">{{ isEdit ? 'Editar' : 'Registrar' }} Movimiento</h2>

        <form @submit.prevent="submitForm(isEdit)" class="flex flex-col gap-4 items-end" autocomplete="off">

            <div v-show="isEdit" class="flex flex-col w-full">
                <label for="createdAt">Fecha</label>
                <BaseInput id="createdAt" type="datetime-local" v-model="movement.date" />
            </div>

            <div class="w-full">
                <label for="type" class="block text-gray-700 dark:text-gray-300">Tipo de Movimiento</label>
                <BaseSelect id="type" v-model="movement.type">
                    <option value="ingreso">Ingreso</option>
                    <option value="gasto">Gasto</option>
                </BaseSelect>
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
                           @input="formatearComoMoneda" />
            </div>

            <div class="w-full">
                <label for="description" class="block text-gray-700 dark:text-gray-300">Descripción</label>
                <BaseInput id="description" v-model="movement.description" />
            </div>

            <div class="flex gap-2">
                <BaseButton type="submit">{{ isEdit ? 'Editar' : 'Registrar' }} Movimiento</BaseButton>
                <BaseButton
                            color="danger"
                            @click="modalStore.isRendered = false">Cerrar</BaseButton>
            </div>
        </form>
    </div>
</template>

<script setup>
import { watchEffect } from 'vue';
import { useMovementform } from '../composables/movementForm';
import { useCategorieStore } from '../stores/categoriesStore';
import BaseButton from './ui/BaseButton.vue';
import BaseInput from './ui/BaseInput.vue';
import BaseSelect from './ui/BaseSelect.vue';

const { isEdit = false, data } = defineProps(['isEdit', 'data']);

const {
    formatearComoMoneda,
    movement,
    submitForm,
    valor,
    modalStore
} = useMovementform();

const categoriesStore = useCategorieStore()

watchEffect(async () => {

    if (isEdit && data) {

        const isoDate = data.date;
        const date = new Date(isoDate);

        const pad = n => n.toString().padStart(2, '0');
        const localDateTime = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

        movement.value = {
            type: data.type,
            CategoryId: data.CategoryId,
            amount: data.amount,
            description: data.description,
            id: data.id,
            date: localDateTime
        }

        formatearComoMoneda(data.amount, false)

        await useCategorieStore().getCategories()
    }

})

</script>
