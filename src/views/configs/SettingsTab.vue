<template>
    <nav
         class="flex justify-around border-t border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
        <RouterLink v-for="route in routes"
                    :key="route.label"
                    :to="route.to"
                    class="py-3 w-full text-center"
                    :class="{ 'font-bold border-b-2 border-blue-500': $route.path === route.to }">
            {{ route.label }}
        </RouterLink>
    </nav>
</template>

<script setup>

const routes = [
    { to: '/configs', label: 'Perfil' },
    { to: '/configs/password', label: 'Contraseña' },
]

</script>