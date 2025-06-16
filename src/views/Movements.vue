<template>
    <div class="container mx-auto max-w-3xl py-4 px-2">

        <!-- Selector de Mes -->
        <div class="mb-6 flex items-center gap-4">
            <label for="month-selector" class="font-medium text-gray-700">Mes:</label>
            <BaseInput type="month" v-model="selectedMonth" id="month-selector" />
        </div>

        <!-- Resumen Mensual -->
        <div class="flex gap-4 justify-between mb-6 p-4 dark:bg-gray-800 bg-blue-50 rounded-lg">

            <div class="dark:text-green-400 dark:text-green-400 text-green-600 font-bold flex gap-1">
                <ArrowTrendingUpIcon class="w-6" />
                <span>Ingresos: {{ formatoMoneda(totalIngreso) }}</span>
            </div>
            <div class="dark:text-red-400 dark:text-red-400 text-red-600 font-bold flex gap-1">
                <ArrowTrendingDownIcon class="w-6" />
                <span>Gastos: {{ formatoMoneda(totalGasto) }}</span>
            </div>
            <div class="font-bold dark:text-indigo-200 text-indigo-700 flex gap-1">
                <CurrencyDollarIcon class="w-6" />
                <span>Saldo: {{ formatoMoneda(balance) }}</span>
            </div>

        </div>
        <!-- Mensaje si no hay datos -->
        <div v-if="movements.length === 0" class="text-center py-8 text-gray-500">
            No hay movimientos para este período
        </div>

        <!-- Listado por días -->
        <div v-else>
            <div v-for="dia in movements" :key="dia.fecha" class="mb-8">
                <!-- Encabezado del día -->
                <div
                     class="flex flex-col gap-1 justify-between items-end p-3 dark:bg-gray-800 bg-gray-100 rounded-t-lg">
                    <h2 class="text-sm text-gray-800 dark:text-gray-200">
                        {{ dia.nombreDia }}, {{ dia.dia }} de {{ dia.mes }}
                    </h2>

                    <div class="flex gap-4">
                        <span class="dark:text-green-400 text-green-600 text-xs sm:text-base" v-if="dia.ingresos > 0">
                            Ingresos: +{{ formatoMoneda(dia.ingresos) }}
                        </span>
                        <span class="dark:text-red-400 text-red-600 text-xs sm:text-base" v-if="dia.gastos > 0">
                            Gastos: -{{ formatoMoneda(dia.gastos) }}
                        </span>
                    </div>
                </div>

                <!-- Movimientos del día -->
                <div
                     class="border border-gray-200 dark:border-gray-700 rounded-b-lg divide-y divide-gray-200 dark:divide-gray-700">
                    <div v-for="mov in dia.detalles" :key="mov.id"
                         class="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-300">
                        <div class="flex justify-between items-start">
                            <div>
                                <div class="font-medium flex items-center gap-2 dark:text-gray-200">
                                    <ArrowTrendingUpIcon v-if="mov.type === 'ingreso'" class="w-6 text-green-500" />
                                    <ArrowTrendingDownIcon v-else class="w-6 text-red-500" />
                                    {{ mov.description }}
                                </div>
                                <div class="text-sm text-gray-500 mt-1 ml-8">
                                    {{ mov.Category?.name }} •
                                    {{ mov.type }}
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
                                <span class="font-medium whitespace-nowrap"
                                      :class="mov.type === 'ingreso' ? 'dark:text-green-400 text-green-600' : 'dark:text-red-400 text-red-600'">
                                    {{ (mov.type === 'gasto' ? '-' : '') + formatoMoneda(mov.amount) }}
                                </span>
                                <div class="flex gap-2 justify-center items-center">
                                    <button @click="edit(mov)"
                                            class="dark:text-blue-400 text-blue-500 hover:text-blue-700 cursor-pointer"
                                            title="Editar movimiento">
                                        <PencilSquareIcon class="h-5 w-5" />
                                    </button>
                                    <button @click="deleteMovement(mov.id)"
                                            class="dark:text-red-400 text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                                            title="Eliminar movimiento">
                                        <TrashIcon class="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <Pagination
                    :currentPage="currentPage"
                    :totalPages="totalPages"
                    @page-changed="fetchMovements" />
    </div>

    <Modal>
        <MovementForm isEdit="true" :data="movement" />
    </Modal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useMovements } from '../composables/movements';
import BaseInput from '../components/ui/BaseInput.vue'
import { PencilSquareIcon, TrashIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon } from '@heroicons/vue/24/solid'
import { useModalStore } from '../components/modal/store/modalStore';
import Modal from '../components/modal/Modal.vue';
import MovementForm from '../components/MovementForm.vue';
import Pagination from '../components/Pagination.vue';
import { useMovementStore } from '../stores/movementStore';
import { formatoMoneda } from '../constants';

const modalStore = useModalStore();
const movementStore = useMovementStore();

const movement = ref({});

const edit = (data) => {
    movement.value = data
    modalStore.showModal = true
}

const {
    deleteMovement,
    currentPage,
    totalPages,
    fetchMovements,
    selectedMonth,
    movements,
    totalGasto,
    totalIngreso,
    balance } = useMovements()

watch(() => movementStore.isSaved, async (newVal) => {
    if (newVal) {
        await fetchMovements()
    }
})

</script>