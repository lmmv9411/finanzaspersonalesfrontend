<template>
    <aside
           :class="[
            'fixed md:static top-0 left-0 w-64 h-full dark:bg-gray-900 bg-white transform transition-transform duration-300 z-50 shadow-xl bg-gray-200',
            isOpen ? 'translate-x-0' : '-translate-x-full',
            'md:translate-x-0'
        ]">
        <div class="p-2 h-full flex flex-col">
            <h2 class="text-lg font-bold mb-6 dark:text-gray-100">Menú</h2>
            <nav class="flex flex-col flex-1 justify-between gap-2">
                <div class="flex flex-col gap-2">
                    <RouterLink
                                v-for="item in menu"
                                :key="item.name"
                                :to="item.to"
                                activeClass="bg-blue-400 text-white"
                                class="px-4 py-2 dark:text-white rounded hover:bg-gray-600 hover:text-white text-gray-700 transition-colors duration-300">
                        {{ item.name }}

                    </RouterLink>
                </div>
                <ToggleTheme class="px-4 py-2 dark:text-white rounded" />
            </nav>
        </div>
    </aside>
</template>

<script setup>
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import ToggleTheme from './ToggleTheme.vue';

const props = defineProps({
    isOpen: Boolean
})

const emits = defineEmits(['toggleSidebar']);

const menu = [
    { name: 'Inicio', to: '/' },
    { name: 'Configuraciones', to: '/configs' },
];

const router = useRouter();

watch(
    () => router.currentRoute.value,
    () => {
        emits('toggleSidebar');
    }
);

</script>