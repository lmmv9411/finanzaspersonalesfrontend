<script setup>
import Balance from './components/Balance.vue';
import Home from './components/Home.vue';
import MovementForm from './components/MovementForm.vue';
import MovementList from './components/MovementList.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <Home />
    <Balance />
    <MovementList />
  </div>
</template>
