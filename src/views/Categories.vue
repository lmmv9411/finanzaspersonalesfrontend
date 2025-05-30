<template>

    <h1 class="dark:text-white font-bold text-xl">Categorias</h1>

    <div class="flex flex-col gap-8">
        <form
              @submit.prevent="createCategory"
              class="shadow-md p-2 rounded dark:bg-gray-800 bg-slate-100 flex gap-2 dark:text-gray-300 items-start w-fit m-auto">

            <BaseInput v-model.trim="name" placeholder="Nombre de categoria" />

            <div class="flex gap-2">
                <BaseButton type="submit">{{ isUpdate ? 'Actualizar' : 'Crear' }}</BaseButton>
                <BaseButton type="cancel" color="danger" v-show="isUpdate">Cancelar</BaseButton>
            </div>
        </form>

        <table class="dark:text-white w-fit table-auto border-collapse whitespace-nowrap m-auto overflow-auto text-xl">
            <thead>
                <tr class="border-b border-gray-400">
                    <th>Nombre</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="categorie in categoriesStore.categories" class="border-b border-gray-300"
                    :key="categorie.id">
                    <td class="p-4 ">{{ categorie.name }}</td>
                    <td class="p-4 flex gap-4">
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
                    </td>
                </tr>
            </tbody>
        </table>
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