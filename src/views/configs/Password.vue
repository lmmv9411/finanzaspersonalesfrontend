<template>
    <div>
        <button
                @click="showIconPicker = true"
                class="flex items-center gap-2 p-2 border rounded dark:border-gray-500">

            <div
                 class="rounded-full p-2 w-10 h-10 flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-xl"
                 :class="[getRandomBgColor(selectedIconName ?? '')]">
                <Icon
                      :icon="selectedIconComponent"
                      class="w-6 h-6 text-white" />
            </div>

            <span class="dark:text-gray-300">{{ selectedIconName || 'Seleccionar icono' }}</span>
        </button>

        <IconPickerSolid
                         v-if="showIconPicker"
                         @selected="handleIconSelected"
                         @close="showIconPicker = false" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import IconPickerSolid from '../../components/IconPickerSolid.vue';
import { Icon } from '@iconify/vue'
import { getRandomBgColor } from './icons';

const showIconPicker = ref(false);
const selectedIconName = ref('');
const selectedIconComponent = ref(null);

async function handleIconSelected(icon) {
    selectedIconName.value = icon.name;
    selectedIconComponent.value = icon.icon
    showIconPicker.value = false;
}
</script>