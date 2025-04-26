<template>
    <div class="flex flex-col h-screen">
        <NavBar @toggleSidebar="isSidebarOpen = true" />

        <div class="flex flex-1 overflow-hidden dark:bg-gray-900">
            <SideBar :isOpen="isSidebarOpen" />

            <main class="overflow-y-auto flex-1">
                <RouterView />
            </main>
        </div>

        <!-- Fondo oscuro para móviles -->
        <div
             v-if="isSidebarOpen"
             @click="isSidebarOpen = false"
             class="fixed inset-0 bg-black/30 bg-opacity-50 z-40 md:hidden"></div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

import { RouterView } from 'vue-router'
import NavBar from './NavBar.vue';
import SideBar from './SideBar.vue';
const isSidebarOpen = ref(false)
</script>