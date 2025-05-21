<template>

    <h1 class="dark:text-white font-bold text-xl">Categorias</h1>

    <div class="flex flex-col gap-8">
        <form
              @submit.prevent="createCategory"
              class="shadow-md p-2 rounded dark:bg-gray-800 bg-slate-100 flex gap-2 dark:text-gray-300 items-start w-fit m-auto flex-wrap">
            <input
                   v-model="name"
                   type="text"
                   placeholder="Nombre de categoria"
                   class="p-2 border border-gray-300 dark:bg-gray-900 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-300 rounded" />

            <button
                    class="bg-blue-500 text-white rounded p-2 cursor-pointer">
                {{ isUpdate ? 'Actualizar' : 'Crear' }}
            </button>
        </form>

        <table class="dark:text-white w-fit table-auto border-collapse whitespace-nowrap m-auto overflow-auto">
            <thead>
                <tr class="border-b border-gray-400">
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="categorie in categoriesStore.categories" class="border-b text-center" :key="categorie.id">
                    <td class="px-4 py-2">{{ categorie.id }}</td>
                    <td class="px-4 py-2">{{ categorie.name }}</td>
                    <td class="px-4 py-2 flex gap-2">
                        <button @click="deleteCategory(categorie.id)"
                                class="bg-red-500 text-white rounded p-2 cursor-pointer">Eliminar</button>
                        <button @click="onUpdateCategory(categorie.id)"
                                class="bg-blue-500 text-white rounded p-2 cursor-pointer">Editar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { useCategories } from '../composables/categories';
import { useCategorieStore } from '../stores/categoriesStore';

const categoriesStore = useCategorieStore()

const {
    name,
    createCategory,
    deleteCategory,
    onUpdateCategory,
    isUpdate
} = useCategories();

</script>