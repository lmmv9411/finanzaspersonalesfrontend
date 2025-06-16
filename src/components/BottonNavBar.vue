<template>
    <nav class="fixed bottom-0 left-0 right-0 bg-gray-200 dark:bg-gray-800 shadow-lg">
        <div class="flex justify-around py-2">
            <router-link
                         v-for="item in navItems"
                         :key="item.to"
                         :to="item.to"
                         class="flex flex-col items-center p-2 text-xs"
                         :class="{
                            'text-blue-500 dark:text-blue-400': $route.path === item.to,
                            'text-gray-400 dark:text-gray-500': $route.path !== item.to
                        }">
                <component :is="item.icon" class="w-6 h-6" />
                <span>{{ item.label }}</span>
            </router-link>
        </div>
    </nav>
</template>

<script setup>
import { ChartBarIcon, HomeIcon, TagIcon, UserIcon } from '@heroicons/vue/24/outline';

/*const navItems = [
    { to: '/configs', label: 'Foto De Perfil', icon: UserCircleIcon },
    { to: '/configs/password', label: 'Contraseña', icon: LockClosedIcon }
];*/

const navItems = [
    { to: '/', icon: HomeIcon, label: 'Home' },
    { to: '/movements', icon: ChartBarIcon, label: 'Movimientos' },
    { to: '/categories', icon: TagIcon, label: 'Categorias' },
    { to: '/configs', icon: UserIcon, label: 'Yo' },
];

</script>