<script setup>
import { useTheme } from '../composables/useTheme';

const { theme } = useTheme();

</script>

<template>
    <select v-model="theme" class="p-2 border border-gray-300 dark:bg-gray-900 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-300 rounded w-full">
        <option value="light">Claro</option>
        <option value="dark">Oscuro</option>
        <option value="system">Automático</option>
    </select>
</template>
