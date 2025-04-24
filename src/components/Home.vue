<template>
    <div>
        <button
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                @click="showModal = true">
            Agregar Movimiento
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

const showModal = ref(false)

</script>