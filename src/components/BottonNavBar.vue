<template>
    <nav class="fixed bottom-0 left-0 right-0 bg-gray-200 dark:bg-gray-800 shadow-lg h-16">
        <div class="flex justify-around py-2 h-full items-center relative">
            <router-link
                         v-for="(item, idx) in navItems"
                         :key="item.to"
                         :to="item.to"
                         class="flex flex-col items-center p-2 text-xs"
                         :class="{
                            'text-blue-500 dark:text-blue-400': $route.path === item.to,
                            'text-gray-400 dark:text-gray-500': $route.path !== item.to,
                            'opacity-0': idx === 2
                        }">
                <component :is="item.icon" class="w-6 h-6" />
                <span class="font-semibold">{{ item.label }}</span>
            </router-link>

            <div class="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/4">
                <div class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center ">
                    <router-link
                                 to="/movement"
                                 class="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors">
                        <PlusIcon class="w-8 h-8" />
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { HomeIcon, TagIcon, UserIcon } from '@heroicons/vue/24/outline';
import { ArrowsRightLeftIcon, PlusIcon } from '@heroicons/vue/24/solid';

const navItems = [
    { to: '/', icon: HomeIcon, label: 'Home' },
    { to: '/movements', icon: ArrowsRightLeftIcon, label: 'Movimientos' },
    { to: '/movement', icon: PlusIcon, label: 'Nuevo' },
    { to: '/categories', icon: TagIcon, label: 'Categorias' },
    { to: '/configs', icon: UserIcon, label: 'Yo' },
];

</script>
