<template>
    <div class="max-w-4xl mx-auto p-4">
        <!-- Panel de icono seleccionado -->
        <div v-if="selectedIcon"
             class="sticky top-0 flex gap-3 mb-4 p-3 bg-blue-50 rounded-lg items-center dark:bg-gray-800">
            <div
                 class="rounded-full p-2 w-10 h-10 flex items-center justify-center transition-all"
                 :class="getRandomBgColor(selectedIcon.name)">
                <Icon :icon="selectedIcon.icon" class="text-white w-6 h-6" />
            </div>
            <span class="font-medium dark:text-gray-300">{{ selectedIcon.name }}</span>
            <button @click="confirmSelection"
                    class="ml-auto px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Usar este icono
            </button>
        </div>

        <!-- Grid de iconos -->
        <div class="flex gap-4 flex-col">
            <div v-for="category in categoriesIcons" :key="category.name">
                <p class="mb-2 font-medium dark:text-gray-300">{{ category.name }}</p>
                <div class="grid grid-cols-6 gap-3 sm:grid-cols-8 md:grid-cols-10">
                    <div
                         v-for="icon in category.icons"
                         @click="selectIcon(icon)"
                         :key="icon.name"
                         class="group flex flex-col items-center">
                        <div
                             class="rounded-full p-2 w-10 h-10 flex items-center justify-center transition-all group-hover:scale-110 cursor-pointer shadow-xl"
                             :class="[
                                selectedIcon?.name === icon.name
                                    ? 'ring-2 ring-indigo-500 scale-110 bg-indigo-100 dark:bg-indigo-900'
                                    : getRandomBgColor(icon.name)
                            ]"
                             :title="icon.name">
                            <Icon
                                  :icon="icon.icon"
                                  class="w-6 h-6"
                                  :class="selectedIcon?.name === icon.name
                                    ? 'text-indigo-600 dark:text-indigo-300'
                                    : 'text-white'" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { categoriesIcons, getRandomBgColor } from '../views/configs/icons'

const selectedIcon = ref(null);

const selectIcon = (icon) => {
    selectedIcon.value = icon;
};

const emit = defineEmits(['selected']);
const confirmSelection = () => {
    if (selectedIcon.value) {
        emit('selected', { ...selectedIcon.value });
    }
};

</script>