<template>
    <header class="flex items-center justify-between bg-slate-800 text-white p-2 shadow-xl">
        <div class="text-xl font-bold">Mis Finanzas</div>

        <div class="md:hidden bg-slate-700 rounded-lg">
            <button class="hamburger hamburger--spin"
                    :class="{ 'is-active': isActive }"
                    @click="toggleSidebar"
                    type="button">
                <span class="hamburger-box">
                    <span class="hamburger-inner"></span>
                </span>
            </button>
        </div>

        <div>
            
        </div>
    </header>
</template>

<script setup>
import 'hamburgers/dist/hamburgers.min.css';
import { onMounted } from 'vue';
import { ref, watch } from 'vue';

const isActive = ref(false)

const props = defineProps({ isOpen: { type: Boolean, } });

const emits = defineEmits(['toggleSidebar']);

watch(() => props.isOpen, newValue => isActive.value = newValue);

const toggleSidebar = () => {
    isActive.value = !isActive.value;
    emits('toggleSidebar');
}

onMounted(() => {

})

</script>

<style scoped>
.hamburger {
    padding: 12px 10px 5px 10px;
    cursor: pointer;
    border-radius: 4px;
}

.hamburger-inner,
.hamburger-inner::before,
.hamburger-inner::after {
    background-color: #fff;
}

.hamburger.is-active .hamburger-inner,
.hamburger.is-active .hamburger-inner::before,
.hamburger.is-active .hamburger-inner::after {
    background-color: #fff;
    /* Cambia el color cuando está activo */
}
</style>