<template>
    <div class="container mx-auto max-w-3xl">

        <!-- Selector de Mes -->
        <div class="mb-6 flex items-center gap-4">
            <label for="month-selector" class="font-medium text-gray-700">Mes:</label>
            <BaseInput type="month" v-model="selectedMonth" id="month-selector" />
        </div>

        <!-- Resumen Mensual -->
        <div class="flex flex-col justify-between items-center mb-6 p-4 dark:bg-gray-800 bg-blue-50 rounded-lg">

            <div class="flex gap-4">
                <div class="text-green-600 font-bold">
                    Ingresos: {{ formatoMoneda(totalIngreso) }}
                </div>
                <div class="text-red-600 font-bold">
                    Gastos: {{ formatoMoneda(totalGasto) }}
                </div>
                <div class="font-bold dark:text-blue-200 text-blue-700">
                    Saldo: {{ formatoMoneda(balance) }}
                </div>
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
                        <span class="text-green-600 text-xs sm:text-base" v-if="dia.ingresos > 0">
                            Ingresos: +{{ formatoMoneda(dia.ingresos) }}
                        </span>
                        <span class="text-red-600 text-xs sm:text-base" v-if="dia.gastos > 0">
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
                                    <span class="w-6 h-6 rounded-full flex items-center justify-center"
                                          :class="mov.type === 'ingreso' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                                        {{ mov.type === 'ingreso' ? '↑' : '↓' }}
                                    </span>
                                    {{ mov.description }}
                                </div>
                                <div class="text-sm text-gray-500 mt-1 ml-8">
                                    {{ mov.Category?.name }} •
                                    {{ mov.type }}
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
                                <span class="font-medium whitespace-nowrap"
                                      :class="mov.type === 'ingreso' ? 'text-green-600' : 'text-red-600'">
                                    {{ (mov.type === 'gasto' ? '-' : '') + formatoMoneda(mov.amount) }}
                                </span>
                                <div class="flex gap-2 justify-center items-center">
                                    <button @click="edit(mov)"
                                            class="text-blue-500 hover:text-blue-700 cursor-pointer"
                                            title="Editar movimiento">
                                        <PencilSquareIcon class="h-5 w-5" />
                                    </button>
                                    <button @click="deleteMovement(mov.id)"
                                            class="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
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
import { computed, ref } from 'vue';
import { useMovements } from '../composables/movements';
import BaseInput from '../components/ui/BaseInput.vue'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/16/solid'
import { useModalStore } from '../components/modal/store/modalStore';
import Modal from '../components/modal/Modal.vue';
import MovementForm from '../components/MovementForm.vue';
import Pagination from '../components/Pagination.vue';


const modalStore = useModalStore();

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

// Formateadores
const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(valor);
};

</script>