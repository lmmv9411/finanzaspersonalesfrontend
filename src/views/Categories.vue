<template>

    <div class="pt-4 flex flex-col gap-8 px-4">
        <form
              @submit.prevent="createCategory"
              class="shadow-md p-2 rounded dark:bg-gray-800 bg-slate-100 flex flex-wrap gap-2 dark:text-gray-300 items-start m-auto">

            <BaseInput v-model.trim="name" placeholder="Nombre de categoria" />

            <div class="flex gap-2">
                <BaseButton type="submit">{{ isUpdate ? 'Actualizar' : 'Crear' }}</BaseButton>
                <BaseButton color="danger" v-show="isUpdate" @click="reset">Cancelar</BaseButton>
                <BaseButton
                            color="secondary"
                            @click="showIconPicker = !showIconPicker"
                            class="flex items-center gap-2 p-2 border rounded dark:border-gray-500">

                    <div
                         v-if="selectedIcon.icon"
                         class="rounded-full p-2 w-8 h-8 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer shadow-xl"
                         :class="[getRandomBgColor(selectedIcon.icon ?? '')]">
                        <Icon
                              :icon="selectedIcon.icon"
                              class="w-6 h-6 text-white" />
                    </div>

                    <span class="dark:text-gray-100">{{ selectedIcon.name || 'Icono' }}</span>
                </BaseButton>
            </div>
        </form>

        <IconPickerSolid
                         v-if="showIconPicker"
                         @selected="handleIconSelected"
                         @close="showIconPicker = false" />

        <div class="container max-w-xs mx-auto flex gap-4 flex-col">
            <div v-for="categorie in categoriesStore.categories" :key="categorie.id">
                <div
                     class="text-xl border gap-4 border-gray-200 dark:border-gray-600 rounded-lg flex justify-between p-4 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-300 shadow-sm">
                    <div :class=[getRandomBgColor(categorie.icon)]
                         class="rounded-full p-2 w-10 h-10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 cursor-pointer shadow-xl">
                        <Icon :icon="categorie.icon" class="text-white" />
                    </div>
                    <span>{{ categorie.name }}</span>
                    <div class="flex gap-2">
                        <button @click="deleteCategory(categorie.id)"
                                class="text-red-500 hover:text-red-700 cursor-pointer"
                                title="Eliminar categoria">
                            <TrashIcon class="h-5 w-5" />
                        </button>
                        <button @click="onUpdateCategory(categorie)"
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
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/16/solid';
import { Icon } from '@iconify/vue';
import IconPickerSolid from '../components/IconPickerSolid.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import { useCategories } from '../composables/categories';
import { useCategorieStore } from '../stores/categoriesStore';
import { getRandomBgColor } from './configs/icons';

const categoriesStore = useCategorieStore()

const {
    name,
    createCategory,
    deleteCategory,
    onUpdateCategory,
    isUpdate,
    selectedIcon,
    handleIconSelected,
    reset,
    showIconPicker
} = useCategories();

</script>