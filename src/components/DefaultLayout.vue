<template>
    <div class="flex flex-row h-screen">

        <SideBar :isOpen="isSidebarOpen" @toggleSidebar="isSidebarOpen = false" />

        <div class="flex flex-col flex-1 overflow-hidden dark:bg-gray-900">

            <!---<NavBar :isOpen="isSidebarOpen" @toggleSidebar="isSidebarOpen = true" />-->

            <main class="overflow-y-auto pb-16 sm:pb-0">
                <RouterView />
            </main>
        </div>

        <BottonNavBar class="sm:hidden" />

        <!--<Transition name="fade">
            <div
                 v-if="isSidebarOpen"
                 @click="isSidebarOpen = false"
                 class="fixed inset-0 bg-black/30 bg-opacity-50 z-40"></div>
        </Transition>-->
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
//import NavBar from './NavBar.vue';
import SideBar from './SideBar.vue';
import BottonNavBar from './BottonNavBar.vue'
const isSidebarOpen = ref(false)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>