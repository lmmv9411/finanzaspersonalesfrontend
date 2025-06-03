<template>
    <div>
        <RouterView /> 
        <SettingsNav />
    </div>
</template>

<script setup>
import SettingsNav from '../components/SettingsNav.vue'
import { RouterView } from 'vue-router';
</script>