<script setup lang="ts">
import { onMounted } from 'vue';
import AddMovementModal from '../components/AddMovementModal.vue';
import Balance from '../components/Balance.vue';
import HomeGraphics from '../components/HomeGraphics.vue';
import { useCategorieStore } from '../stores/categoriesStore';

const categoriesStore = useCategorieStore()
onMounted(async () => await categoriesStore.getCategories())

</script>

<template>
    <div class="min-h-screen dark:bg-gray-900 p-2 flex flex-col sm:flex-row sm:items-start gap-4 sm:items-center">
        <AddMovementModal />
        <Balance />
        <HomeGraphics />
    </div>
</template>