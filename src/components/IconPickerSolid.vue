<template>
    <div class="max-w-4xl mx-auto p-4">

        <!-- Icono seleccionado -->
        <div v-if="selectedIcon" class="sticky top-0 mb-4 p-3 bg-blue-50 rounded-lg flex items-center dark:bg-gray-800">
            <component :is="selectedIcon?.icon" class="w-6 h-6 text-blue-600 mr-2" />
            <span class="font-medium dark:text-gray-300">{{ selectedIcon.iconName }}</span>
            <button
                    @click="confirmSelection"
                    class="ml-auto px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Usar este icono
            </button>
        </div>

        <div class="flex gap-4 flex-col">
            <div v-for="{ name, icons } in loadedIcons" :key="name">
                <p class="mb-2 font-medium dark:text-gray-300">{{ name }}</p>
                <div class="grid grid-cols-6 gap-4 sm:grid-cols-8 md:grid-cols-10">
                    <div v-for="icon in icons"
                         @click="selectIcon(icon)"
                         class=""
                         :class="[
                            'p-2 border rounded-lg cursor-pointer flex flex-col items-center hover:bg-indigo-200 dark:hover:bg-indigo-900',
                            selectedIcon?.iconName === icon.iconName ? 'border-indigo-700 bg-indigo-100 dark:bg-indigo-700' : 'border-gray-200'
                        ]"
                         :title="icon.iconName">
                        <component :is="icon.icon" class="w-8 text-indigo-500 dark:text-indigo-300" />
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>
import * as Icons from '@heroicons/vue/24/solid';
import { onMounted, ref } from 'vue';
import { categoriesIcons } from '../views/configs/icons';

// 2. Carga dinámica de iconos
const loadedIcons = ref([]);
const selectedIcon = ref(null);

onMounted(async () => {
    // Cargar los primeros iconos
    await loadIcons();
});

async function loadIcons() {
    loadedIcons.value = categoriesIcons.map(c => {

        const listIcons = [];

        c.icons.forEach(iconName => {
            listIcons.push({ icon: Icons[iconName], iconName })
        })

        return {
            name: c.name,
            icons: listIcons
        }
    })
}

// 5. Selección de icono
function selectIcon(icon) {
    selectedIcon.value = icon;
}

// 6. Confirmar selección
const emit = defineEmits(['selected']);
function confirmSelection() {
    if (selectedIcon.value) {
        emit('selected', {
            name: selectedIcon.value.iconName,
            displayName: selectedIcon.value.iconName
        });
    }
}


</script>