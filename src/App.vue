<script setup>
import AddMovementModal from './components/AddMovementModal.vue';
import Balance from './components/Balance.vue';
import MovementList from './components/MovementList.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <AddMovementModal />
    <Balance />
    <MovementList />
  </div>
</template>
