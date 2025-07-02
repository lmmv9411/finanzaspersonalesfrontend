<template>

    <div class="pt-4 flex flex-col gap-4 px-4 items-end">

        <div @click="showForm = !showForm" class="rounded-full bg-indigo-600 p-3 text-white cursor-pointer">
            <template v-if="!showForm">
                <PlusIcon class="w-7 h-7" />
            </template>
            <template v-else>
                <EyeSlashIcon class="w-7 y-7" />
            </template>
        </div>

        <Transition name="slide-categorie">
            <form v-if="showForm" @submit.prevent="createCategory"
                  class="shadow-md p-4 rounded dark:bg-gray-800 bg-slate-100 flex flex-wrap gap-2 dark:text-gray-300 items-start m-auto">

                <BaseInput v-model.trim="name" placeholder="Nombre de categoria" />

                <div class="flex gap-2">
                    <BaseButton type="submit">{{ isUpdate ? 'Actualizar' : 'Crear' }}</BaseButton>
                    <BaseButton color="secondary" @click="showIconPicker = !showIconPicker"
                                class="flex items-center gap-2 p-2 border rounded dark:border-gray-500">

                        <div v-if="selectedIcon.icon"
                             class="rounded-full p-2 w-8 h-8 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer shadow-xl"
                             :class="[getRandomBgColor(selectedIcon.icon ?? '')]">
                            <Icon :icon="selectedIcon.icon" class="w-6 h-6 text-white" />
                        </div>

                        <span class="dark:text-gray-100">{{ selectedIcon.name || 'Icono' }}</span>
                    </BaseButton>
                    <BaseButton color="danger" v-show="isUpdate" @click.stop="handleCancel">Cancelar</BaseButton>
                </div>
            </form>
        </Transition>

        <IconPickerSolid v-if="showIconPicker" @selected="handleIconSelected" @close="showIconPicker = false" />

        <div class="container max-w-lg mx-auto grid grid-cols-4 gap-4">
            <div v-for="categorie in categoriesStore.categories" :key="categorie.id">
                <div @click.stop="handleClick(categorie.id)"
                     class="rounded-lg dark:border-gray-600 gap-1 flex flex-col justify-between items-center p-4 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-300 shadow-sm">

                    <div :class=[getRandomBgColor(categorie.icon)]
                         class="text-xl rounded-full p-2 w-10 h-10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 cursor-pointer shadow-xl">
                        <Icon :icon="categorie.icon" class="text-white" />
                    </div>

                    <span class="text-xs">{{ categorie.name }}</span>

                    <Transition name="slide-categorie">
                        <div class="flex gap-2" v-if="categorie.id === categorieActive">
                            <button @click.stop="deleteCategory(categorie.id)"
                                    class="text-red-500 hover:text-red-700 cursor-pointer" title="Eliminar categoria">
                                <TrashIcon class="h-5 w-5" />
                            </button>
                            <button @click.stop="handleUpdate(categorie)"
                                    class="text-blue-500 hover:text-blue-700 cursor-pointer" title="Editar categoria">
                                <PencilSquareIcon class="h-5 w-5" />
                            </button>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { PencilSquareIcon, TrashIcon, PlusIcon, EyeSlashIcon } from '@heroicons/vue/16/solid';
import { Icon } from '@iconify/vue';
import IconPickerSolid from '../components/IconPickerSolid.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import { useCategories } from '../composables/categories';
import { useCategorieStore } from '../stores/categoriesStore';
import { getRandomBgColor } from './configs/icons';
import { ref } from 'vue';

const categoriesStore = useCategorieStore()

const categorieActive = ref(null)
const showForm = ref(false)

const handleClick = (idCategorie) => {
    if (categorieActive.value === idCategorie) {
        categorieActive.value = null
    } else {
        categorieActive.value = idCategorie
    }
}

const handleUpdate = (categorie) => {
    showForm.value = true
    onUpdateCategory(categorie)
}

const handleCancel = () => {
    showForm.value = false
    reset()
}

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

<style scoped>
.slide-categorie-enter-active,
.slide-categorie-leave-active {
    transition: all 0.3s ease-in-out;
}

.slide-categorie-enter-from,
.slide-categorie-leave-to {
    opacity: 0;
    transform: translateY(8px);
}
</style>