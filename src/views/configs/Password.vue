<template>
    <div>
        <button @click="showIconPicker = true" class="flex items-center gap-2 p-2 border rounded">
            <component
                       :is="selectedIconComponent"
                       v-if="selectedIconComponent"
                       class="w-8 text-indigo-800" />
            <span>{{ selectedIconName || 'Seleccionar icono' }}</span>
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
import * as Icons from '@heroicons/vue/24/solid'
import { computed } from 'vue';

const showIconPicker = ref(false);
const selectedIconName = ref('');
const selectedIconComponent = ref(null);

async function handleIconSelected(icon) {
    selectedIconName.value = icon.displayName;

    // Cargar el componente del icono dinámicamente
    const { name } = icon;
    selectedIconComponent.value = Icons[name]

    showIconPicker.value = false;
}
</script>