<template>
    <div>
        <button
                class="bg-indigo-500 rounded-full hover:bg-indigo-700 text-white p-4 fixed sm:bottom-6 bottom-20 right-6 shadow-lg transition duration-300 ease-in-out cursor-pointer"
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