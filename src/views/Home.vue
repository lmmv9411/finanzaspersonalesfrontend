<script setup lang="ts">
import AddMovementModal from '../components/AddMovementModal.vue';
import Balance from '../components/Balance.vue';
import HomeGraphics from '../components/HomeGraphics.vue';

</script>

<template>
    <div class="min-h-screen dark:bg-gray-900 p-2 flex flex-col sm:flex-row sm:items-start gap-4 sm:items-center">
        <AddMovementModal />
        <Balance />
        <HomeGraphics />
    </div>
</template>