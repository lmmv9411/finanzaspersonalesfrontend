<template>
    <div class="">
        <SettingsTab />
        <RouterView />
        <!--<SettingsNav />-->
    </div>
</template>

<script setup>
//import SettingsNav from '../components/SettingsNav.vue'
import { RouterView } from 'vue-router';
import SettingsTab from './configs/SettingsTab.vue';
</script>