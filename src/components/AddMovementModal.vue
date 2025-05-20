<template>
    <div>
        <button
                class="bg-blue-600 rounded-full hover:bg-blue-700 text-white p-4 fixed bottom-6 right-6 shadow-lg transition duration-300 ease-in-out cursor-pointer"
                @click="modalStore.showModal = true">
            <PlusIcon class="w-8 h-8 inline-block" stroke-width="2.5" />
        </button>

        <Modal>
            <MovementForm />
        </Modal>
    </div>
</template>

<script setup>
import { PlusIcon } from '@heroicons/vue/24/solid';
import { useModalStore } from '../components/modal/store/modalStore';
import Modal from './modal/Modal.vue';
import MovementForm from './MovementForm.vue';

const modalStore = useModalStore();

</script>