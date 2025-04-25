<script setup>
import { useTheme } from '../composables/useTheme';

const { theme } = useTheme();

</script>

<template>
    <div class="bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
        <div class="mt-4">
            <select v-model="theme" class="ml-4 bg-white dark:bg-gray-700 text-black dark:text-white">
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="system">Automático</option>
            </select>
        </div>
    </div>
</template>
