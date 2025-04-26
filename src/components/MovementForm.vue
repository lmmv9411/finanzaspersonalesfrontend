<template>
    <div
         class=" mx-auto p-4 border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
        <h2 class="text-2xl font-semibold mb-4" @click="toggle">Registrar Movimiento</h2>

        <form @submit.prevent="submitForm" class="flex flex-col gap-4 items-end" autocomplete="off">

            <div class="w-full">
                <label for="type" class="block text-gray-700 dark:text-gray-300">Tipo de Movimiento</label>
                <select
                        id="type"
                        v-model="movement.type"
                        class="p-2 w-full border border-gray-300 dark:bg-gray-900 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-300 rounded">
                    <option value="ingreso">Ingreso</option>
                    <option value="gasto">Gasto</option>
                </select>
            </div>

            <div class="w-full">
                <label for="amount" class="block text-gray-700 dark:text-gray-300">Monto</label>
                <input
                       type="tel"
                       id="amount"
                       v-model="valor"
                       @input="formatearComoMoneda"
                       class="p-2 border border-gray-300 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-300 rounded w-full"
                       required />
            </div>

            <div class="w-full">
                <label for="description" class="block text-gray-700 dark:text-gray-300">Descripción</label>
                <input
                       type="text"
                       id="description"
                       v-model="movement.description"
                       class="p-2 border border-gray-300 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-300 rounded w-full" />
            </div>

            <div class="w-full">
                <label for="category" class="block text-gray-700 dark:text-gray-300">Categoría</label>
                <select
                        id="category"
                        v-model="movement.CategoryId"
                        class="p-2 border border-gray-300 dark:bg-gray-900 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-300 rounded w-full">
                    <option value="" disabled>Selecciona una categoría</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
            </div>

            <button type="submit" class="w-full sm:w-auto p-2 bg-blue-500 text-white rounded">
                Registrar Movimiento
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMovementStore } from '../stores/movementStore'

const movementStore = useMovementStore()

// movimiento vacío
const movement = ref({
    type: 'ingreso',
    amount: '',
    description: '',
    CategoryId: ''
})

// categorías disponibles
const categories = ref([])

// enviar movimiento
const submitForm = async () => {

    movement.value.amount = valor.value.replace(/\D/g, ''); // Limpiar el valor antes de enviarlo

    await movementStore.addMovement(movement.value)
    resetForm()

}

// obtener categorías
const fetchCategories = async () => {
    try {
        const response = await fetch('http://192.168.1.45:3000/api/categories')
        const data = await response.json()
        categories.value = data
    } catch (error) {
        console.error('Error al cargar categorías')
    }
}

// reiniciar formulario
const resetForm = () => {
    movement.value = {
        type: 'ingreso',
        amount: '',
        description: '',
        categoryId: ''
    }
}

// cargar categorías al montar componente
onMounted(() => {
    fetchCategories()
})

const valor = ref('');

function formatearComoMoneda(event) {
    // Remover caracteres que no sean números
    const numeroLimpio = event.target.value.replace(/\D/g, '');

    // Si está vacío, limpiar el input
    if (numeroLimpio === '') {
        valor.value = '';
        return;
    }

    // Convertir a número y formatear
    const numero = parseInt(numeroLimpio, 10);

    // Convertir a número
    if (isNaN(numero)) {
        valor.value = '';
        return;
    }

    const formatoCOP = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    valor.value = formatoCOP.format(numero);
}


</script>
