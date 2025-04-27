<script setup lang="ts">
import AddMovementModal from '../components/AddMovementModal.vue';
import Balance from '../components/Balance.vue';

</script>

<template>
    <div class="min-h-screen dark:bg-gray-900 p-2 flex flex-col sm:items-center">
        <AddMovementModal />
        <Balance />
    </div>
</template>