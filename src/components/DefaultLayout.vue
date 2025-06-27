<template>
    <div class="flex flex-row h-screen">

        <SideBar />

        <main class="flex-1 overflow-y-auto pb-16 sm:pb-0 dark:bg-gray-900">
            <RouterView />
        </main>

        <BottonNavBar class="sm:hidden" />

    </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import BottonNavBar from './BottonNavBar.vue';
import SideBar from './SideBar.vue';
</script>