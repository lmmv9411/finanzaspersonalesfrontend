<template>
    <aside
           :class="[
            'fixed md:static top-0 left-0 w-64 h-full dark:bg-indigo-900 bg-indigo-700 transform transition-transform duration-300 z-50 shadow-xl bg-gray-200',
            isOpen ? 'translate-x-0' : '-translate-x-full',
            'md:translate-x-0'
        ]">
        <div class="p-2 h-full flex flex-col">
            <div class="p-4">
                <span class="text-sm text-bold dark:text-gray-200 text-gray-100">{{ user.name }} {{ user.lastName
                }}</span>
            </div>
            <nav class="flex flex-col flex-1 justify-between gap-2">
                <div class="flex flex-col gap-2">
                    <RouterLink
                                v-for="item in menu"
                                :key="item.name"
                                :to="item.to"
                                :class="{ 'bg-indigo-500 text-white': $route.path === item.to }"
                                class="flex gap-4 p-4 dark:text-gray-100 rounded hover:bg-indigo-900 dark:hover:bg-indigo-700 hover:text-white text-gray-200 transition-colors duration-300"
                                @click="emits('toggleSidebar')">
                        <component
                                   v-if="item.icon"
                                   :is="item.icon"
                                   class="w-5 h-5 inline-block" />
                        <span>{{ item.name }}</span>
                    </RouterLink>
                </div>
                <div class="flex gap-2 flex-col">
                    <button
                            @click="logout"
                            class="dark:hover:bg-indigo-700 flex gap-4 w-full cursor-pointer px-4 py-2 dark:text-gray-200 text-gray-100 rounded hover:bg-indigo-900 hover:text-white transition-colors duration-300">
                        <ArrowRightStartOnRectangleIcon class="w-5 h-5 inline-block" />
                        <span>Cerrar Sesión</span>
                    </button>

                    <ToggleTheme class="px-4 py-2 dark:text-gray-100 text-gray-200 rounded" />
                </div>
            </nav>
        </div>
    </aside>
</template>

<script setup>
import { AdjustmentsVerticalIcon, ArrowRightStartOnRectangleIcon, ChartBarIcon, HomeIcon, TagIcon } from '@heroicons/vue/24/solid';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ToggleTheme from './ToggleTheme.vue';
import api from '../constants/api';

const props = defineProps({ isOpen: Boolean })

const emits = defineEmits(['toggleSidebar']);

const menu = [
    { name: 'Home', to: '/', icon: HomeIcon },
    { name: 'Movimientos', to: '/movements', icon: ChartBarIcon },
    { name: 'Categorias', to: '/categories', icon: TagIcon },
    { name: 'Configuraciones', to: '/configs', icon: AdjustmentsVerticalIcon },
];

const router = useRouter();

const logout = async () => {
    /*await api.post('/user/logout')
    router.push({ name: 'Login' })*/
    localStorage.removeItem('jwt_token')
    router.push({ name: 'Login' })
}

const user = ref({});

onMounted(async () => {
    const res = await api.get('/user')
    user.value = res.data;
})


</script>