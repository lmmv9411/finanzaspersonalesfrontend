<template>
    <div>
        <button
                class="bg-blue-600 rounded-full hover:bg-blue-700 text-white p-4 fixed bottom-6 right-6 shadow-lg transition duration-300 ease-in-out cursor-pointer"
                @click="showModal = true">
            <PlusIcon class="w-8 h-8 inline-block" stroke-width="2.5" />
        </button>

        <Modal :visible="showModal" @close="showModal = false">
            <MovementForm />
        </Modal>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Modal from './Modal.vue'
import MovementForm from './MovementForm.vue';
import { PlusIcon } from '@heroicons/vue/24/solid';

const showModal = ref(false)

</script>