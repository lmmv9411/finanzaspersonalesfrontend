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
    <div class="dark:bg-gray-900 p-3 flex flex-col gap-4">
        <Balance />
        <div class="flex flex-col sm:flex-row gap-4">
            <HomeGraphics/>
        </div>
        <AddMovementModal />
    </div>
</template>