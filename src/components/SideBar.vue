<template>
    <aside
           class="fixed md:static top-0 left-0 w-64 h-full dark:bg-gray-900 bg-gray-700 transform transition-transform duration-300 z-50 shadow-xl bg-gray-200 -translate-x-full md:translate-x-0">
        <div class="p-2 h-full flex flex-col">
            <div class="flex items-center py-4 px-2 gap-2">
                <img
                     :src="profileUrl"
                     alt="Foto de perfil"
                     class="w-20 h-20 rounded-full object-cover border-1 border-gray-300 dark:border-gray-600 shadow" />
                <span class="text-lg font-bold dark:text-gray-200 text-gray-100">
                    {{ user?.name }} {{ user?.lastName }}
                </span>
            </div>
            <nav class="flex flex-col flex-1 justify-between gap-2">
                <div class="flex flex-col gap-2">
                    <RouterLink
                                v-for="item in menu"
                                :key="item.name"
                                :to="item.to"
                                :class="{ 'bg-indigo-500 text-white': $route.path === item.to }"
                                class="flex gap-4 p-4 dark:text-gray-100 rounded hover:bg-indigo-900 dark:hover:bg-indigo-700 hover:text-white text-gray-200 transition-colors duration-300">
                        <component
                                   v-if="item.icon"
                                   :is="item.icon"
                                   class="w-5 h-5 inline-block" />
                        <span>{{ item.name }}</span>
                    </RouterLink>
                    <button
                            @click="logout"
                            class="dark:hover:bg-indigo-700 flex gap-4 w-full cursor-pointer p-4 dark:text-gray-200 text-gray-100 rounded hover:bg-indigo-900 hover:text-white transition-colors duration-300">
                        <ArrowRightStartOnRectangleIcon class="w-5 h-5 inline-block" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>

                <ToggleTheme class="w-fit self-center" />

            </nav>
        </div>
    </aside>
</template>

<script setup>
import { AdjustmentsVerticalIcon, ArrowRightStartOnRectangleIcon, ChartBarIcon, HomeIcon, PlusIcon, TagIcon } from '@heroicons/vue/24/solid';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BASE_URL } from '../constants';
import api from '../constants/api';
import { useUserStore } from '../stores/userStore';
import ToggleTheme from './ToggleTheme.vue';
import { storeToRefs } from 'pinia';

const menu = [
    { name: 'Home', to: '/', icon: HomeIcon },
    { name: 'Nuevo Movimiento', to: '/movement', icon: PlusIcon },
    { name: 'Movimientos', to: '/movements', icon: ChartBarIcon },
    { name: 'Categorias', to: '/categories', icon: TagIcon },
    { name: 'Configuraciones', to: '/configs', icon: AdjustmentsVerticalIcon },
];

const router = useRouter();

const logout = () => {
    /*await api.post('/user/logout')
    router.push({ name: 'Login' })*/
    localStorage.removeItem('jwt_token')
    router.push({ name: 'Login' })
}

const { user, profileUrl } = storeToRefs(useUserStore());

onMounted(async () => {
    const { data } = await api.get('/user')
    user.value = data;
    profileUrl.value = `${BASE_URL}${data.profilePicture}`
})


</script>