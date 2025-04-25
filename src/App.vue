<script setup>
import AddMovementModal from './components/AddMovementModal.vue';
import Balance from './components/Balance.vue';
import MovementList from './components/MovementList.vue';
import ToggleTheme from './components/ToggleTheme.vue';

</script>

<template>
  <div class="min-h-screen dark:bg-gray-900 p-6 flex flex-col sm:items-center">
    <ToggleTheme />
    <AddMovementModal />
    <Balance />
    <MovementList />
  </div>
</template>
