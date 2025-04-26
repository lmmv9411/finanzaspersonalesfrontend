<script setup lang="ts">
import AddMovementModal from '../components/AddMovementModal.vue';
import Balance from '../components/Balance.vue';
import MovementList from '../components/MovementList.vue';

</script>

<template>
    <div class="min-h-screen dark:bg-gray-900 p-6 flex flex-col sm:items-center">
        <AddMovementModal />
        <Balance />
        <MovementList />
    </div>
</template>