<template>

    <h2 class="mx-auto dark:text-white w-fit text-2xl font-semibold mt-4">Movimientos Registrados</h2>

    <div
         class="shadow-md p-4 rounded dark:bg-gray-800 bg-slate-100 flex gap-2 dark:text-gray-300 items-start sm:flex-row
        sm:items-end w-fit m-auto flex-wrap">

        <div class="flex flex-row items-center gap-4">
            <label for="selectedMonth" class="block text-gray-700 dark:text-gray-300">Filtrar Mes</label>
            <input v-model="selectedMonth" type="month" id="selectedMonth"
                   class="p-2 border border-gray-300 dark:bg-gray-900 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 rounded transition-colors duration-300" />
        </div>
    </div>

    <div class="w-full mx-auto p-4 overflow-x-auto">

        <table class="dark:text-white w-full table-auto border-collapse whitespace-nowrap text-lg">
            <thead>
                <tr class="border-b border-gray-400">
                    <th class="px-4 py-2">Tipo</th>
                    <th class="px-4 py-2">Monto</th>
                    <th class="px-4 py-2">Descripción</th>
                    <th class="px-4 py-2">Categoría</th>
                    <th class="px-4 py-2">Fecha</th>
                    <th class="px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="movement in movements" :key="movement.id" class="border-b border-gray-300">
                    <td class="p-4">
                        <span class="font-bold" :class="{
                            'text-green-600': movement.type === 'ingreso',
                            'text-red-600': movement.type !== 'ingreso'
                        }">{{ movement.type }}</span>
                    </td>
                    <td class="p-4"
                        :class="{ 'text-green-600': movement.type === 'ingreso', 'text-red-600': movement.type !== 'ingreso' }">
                        {{
                            new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                maximumFractionDigits: 0
                            }).format(movement.type === 'gasto' ? movement.amount * -1 : movement.amount)
                        }}
                    </td>
                    <td class="p-4">{{ movement.description }}</td>
                    <td class="p-4">{{ movement.Category.name }}</td>
                    <td class="p-4">{{ new Date(movement.date).toLocaleString() }}</td>
                    <td>
                        <div class="flex gap-2 justify-center items-center">
                            <button @click="edit(movement)"
                                    class="text-blue-500 hover:text-blue-700 cursor-pointer" title="Editar movimiento">
                                <PencilSquareIcon class="h-5 w-5" />
                            </button>
                            <button @click="deleteMovement(movement.id)"
                                    class="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                                    title="Eliminar movimiento">
                                <TrashIcon class="h-5 w-5" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>

    <Pagination
                :currentPage="currentPage"
                :totalPages="totalPages"
                @page-changed="fetchMovements" />


    <Modal>
        <MovementForm isEdit="true" :data="movement" />
    </Modal>

</template>

<script setup>
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/16/solid';
import { ref } from 'vue';
import Modal from '../components/modal/Modal.vue';
import { useModalStore } from '../components/modal/store/modalStore';
import MovementForm from '../components/MovementForm.vue';
import { useMovements } from '../composables/movements';
import Pagination from '../components/Pagination.vue';

const modalStore = useModalStore();
const movement = ref({});

const edit = (data) => {
    movement.value = data
    modalStore.showModal = true
}

const {
    selectedMonth,
    movements,
    deleteMovement,
    currentPage,
    totalPages,
    fetchMovements
} = useMovements()

</script>
