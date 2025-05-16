import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useModalStore = defineStore('modal', () => {
    const isRendered = ref(false);
    const showModal = ref(false)

    watch(showModal, (nv) => {
        if (nv) {
            setTimeout(() => isRendered.value = true, 150);
        }
    })

    watch(isRendered, (nv) => {
        if (!nv) {
            setTimeout(() => showModal.value = false, 300);
        }
    })

    return { isRendered, showModal }
})