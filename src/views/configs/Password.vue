<template>
    <div class="">
        <BaseButton
                    color="blue"
                    @click="showIconPicker = !showIconPicker"
                    class="flex items-center gap-2 p-2 border rounded dark:border-gray-500">

            <div
                 v-if="selectedIcon.name"
                 class="rounded-full p-2 w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer shadow-xl"
                 :class="[getRandomBgColor(selectedIcon.name ?? '')]">
                <Icon
                      :icon="selectedIcon.icon"
                      class="w-6 h-6 text-white" />
            </div>

            <span class="dark:text-gray-100">{{ selectedIcon.name || 'Seleccionar icono' }}</span>
        </BaseButton>

        <IconPickerSolid
                         v-if="showIconPicker"
                         @selected="handleIconSelected"
                         @close="showIconPicker = false" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import IconPickerSolid from '../../components/IconPickerSolid.vue';
import { getRandomBgColor } from './icons';
import BaseButton from '../../components/ui/BaseButton.vue'

const showIconPicker = ref(false);
const selectedIcon = ref({});

const handleIconSelected = (icon) => selectedIcon.value = icon;

</script>