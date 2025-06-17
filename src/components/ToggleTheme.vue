<script setup>
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/vue/24/outline';
import { useTheme } from '../composables/useTheme';

const { theme } = useTheme();

const handleTheme = (t) => theme.value = t;

</script>

<template>

    <div class="flex rounded-lg items-center border border-gray-500 dark:border-gray-700 p-1">
        <div @click="handleTheme('light')" class="p-1 rounded-lg cursor-pointer"
             :class="[theme === 'light' ? 'bg-gray-200' : '']">
            <SunIcon class="w-7 sm:w-5 text-yellow-500" />
        </div>
        <div @click="handleTheme('dark')" class="p-1 rounded-lg cursor-pointer"
             :class="[theme === 'dark' ? 'bg-gray-700' : '']">
            <MoonIcon class="w-7 sm:w-5 dark:text-blue-400 text-gray-300" />
        </div>
        <div @click="handleTheme('system')" class="p-1 rounded-lg cursor-pointer"
             :class="[theme === 'system' ? 'dark:bg-gray-700 bg-gray-300' : '']">
            <ComputerDesktopIcon class="w-7 sm:w-5 text-green-500" />
        </div>
    </div>

</template>
