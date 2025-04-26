<template>
    <aside
           :class="[
            'fixed md:static top-0 left-0 w-64 h-full dark:bg-gray-900 bg-white transform transition-transform duration-300 z-50',
            isOpen ? 'translate-x-0' : '-translate-x-full',
            'md:translate-x-0'
        ]">
        <div class="p-4">
            <h2 class="text-lg font-bold mb-6 dark:text-gray-100">Menú</h2>
            <nav class="flex flex-col gap-4">
                <RouterLink to="/" class="dark:text-gray-100 text-gray-700 hover:text-blue-600">Inicio</RouterLink>
                <RouterLink to="/profile" class="dark:text-gray-100 text-gray-700 hover:text-blue-600">Perfil</RouterLink>
                <RouterLink to="/settings" class="dark:text-gray-100 text-gray-700 hover:text-blue-600">Configuraciones</RouterLink>
            </nav>
        </div>
    </aside>
</template>

<script setup>
defineProps({
    isOpen: Boolean
})
</script>