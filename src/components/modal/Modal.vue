<template>
    <div
         v-if="modalStore.showModal"
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
         @click.self="close">
        <Transition name="slide-down">
            <div
                 v-show="modalStore.isRendered"
                 class="bg-slate-100 dark:bg-gray-900 p-4 rounded-lg shadow-xl w-90">
                <slot></slot>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { useModalStore } from './store/modalStore';

const modalStore = useModalStore();

const close = () => modalStore.isRendered = false

</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.slide-down-enter-from {
    opacity: 0;
    transform: translateY(-50px);
}

.slide-down-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.slide-down-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-50px);
}
</style>