<template>
    <section class="py-4">
        <div class="max-w-4xl mx-auto px-4">
            <h2 class="text-2xl font-semibold mb-4 dark:text-gray-100">Gestión</h2>

            <div class="flex gap-2 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                <button
                    type="button"
                    class="px-4 py-2 rounded-md text-sm font-semibold cursor-pointer"
                    :class="activeTab === 'categories'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
                    @click="activeTab = 'categories'"
                >
                    Categorías
                </button>

                <button
                    type="button"
                    class="px-4 py-2 rounded-md text-sm font-semibold cursor-pointer"
                    :class="activeTab === 'accounts'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
                    @click="activeTab = 'accounts'"
                >
                    Cuentas
                </button>
            </div>
        </div>

        <Categories v-if="activeTab === 'categories'" />
        <Accounts v-else />
    </section>
</template>

<script setup>
import { ref } from 'vue';
import Accounts from './Accounts.vue';
import Categories from './Categories.vue';

const activeTab = ref('categories');
</script>
