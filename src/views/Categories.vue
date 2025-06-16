<template>

    <div class="pt-4 flex flex-col gap-8">
        <form
              @submit.prevent="createCategory"
              class="shadow-md p-2 rounded dark:bg-gray-800 bg-slate-100 flex gap-2 dark:text-gray-300 items-start w-fit m-auto">

            <BaseInput v-model.trim="name" placeholder="Nombre de categoria" />

            <div class="flex gap-2">
                <BaseButton type="submit">{{ isUpdate ? 'Actualizar' : 'Crear' }}</BaseButton>
                <BaseButton type="cancel" color="danger" v-show="isUpdate">Cancelar</BaseButton>
            </div>
        </form>

        <div class="container max-w-xs mx-auto flex gap-4 flex-col">
            <div v-for="categorie in categoriesStore.categories" :key="categorie.id">
                <div
                     class="text-xl border gap-4 border-gray-200 dark:border-gray-600 rounded-lg flex justify-between p-4 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-300 shadow-sm">
                    <span>{{ categorie.name }}</span>
                    <div class="flex gap-2">
                        <button @click="deleteCategory(categorie.id)"
                                class="text-red-500 hover:text-red-700 cursor-pointer"
                                title="Eliminar categoria">
                            <TrashIcon class="h-5 w-5" />
                        </button>
                        <button @click="onUpdateCategory(categorie.id)"
                                class="text-blue-500 hover:text-blue-700 cursor-pointer"
                                title="Editar categoria">
                            <PencilSquareIcon class="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { useCategories } from '../composables/categories';
import { useCategorieStore } from '../stores/categoriesStore';
import BaseButton from '../components/ui/BaseButton.vue';
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/16/solid';
import BaseInput from '../components/ui/BaseInput.vue';

const categoriesStore = useCategorieStore()

const {
    name,
    createCategory,
    deleteCategory,
    onUpdateCategory,
    isUpdate
} = useCategories();

</script>