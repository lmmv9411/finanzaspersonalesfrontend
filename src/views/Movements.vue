<template>
    <div class="container mx-auto max-w-3xl py-4 px-2">

        <!-- Botón para mostrar/ocultar filtros -->
        <div class="mb-4 flex justify-end">
            <button
                    @click="showFilters = !showFilters"
                    class="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <FunnelIcon class="h-4 w-4" />
                <span>{{ showFilters ? 'Ocultar filtros' : 'Mostrar filtros' }}</span>
            </button>
        </div>

        <Transition name="filter-slide">
            <div v-if="showFilters"
                 class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <!-- Selector de Mes -->
                <div>
                    <label for="month-selector"
                           class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mes:</label>
                    <BaseInput type="month" v-model="selectedMonth" id="month-selector" />
                </div>

                <!-- Filtro por Tipo -->
                <div>
                    <label for="type-filter"
                           class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo:</label>
                    <select id="type-filter" v-model="selectedType"
                            class="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="">Todos</option>
                        <option value="ingreso">Ingresos</option>
                        <option value="gasto">Gastos</option>
                    </select>
                </div>

                <!-- Filtro por Categoría -->
                <div>
                    <label for="category-filter"
                           class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría:</label>
                    <select id="category-filter" v-model="selectedCategory"
                            class="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="">Todas</option>
                        <option v-for="category in categoriesStore.categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                </div>
            </div>
        </Transition>
        <!-- Resumen Mensual -->
        <div class="flex gap-2 justify-between mb-6 p-2 dark:bg-gray-800 bg-blue-50 rounded-lg">

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

        <!-- Área de movimientos con loader local -->
        <div v-if="isLoading" class="relative min-h-[200px]">
            <!-- Overlay de carga -->
            <div v-if="isLoading"
                 class="absolute inset-0 bg-white/70 dark:bg-gray-800/70 z-10 flex items-center justify-center rounded-lg">
                <div class="text-center">
                    <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <span class="text-gray-600 dark:text-gray-300">Cargando movimientos...</span>
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
                                <div class="text-sm text-gray-500 mt-1 flex gap-2 items-center">
                                    <div :class=[getRandomBgColor(mov.Category.icon)]
                                         class="rounded-full p-1 text-white text-lg">
                                        <Icon :icon="mov.Category.icon" />
                                    </div>
                                    {{ mov.Category.name }} •
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
import { onMounted, ref, watch } from 'vue';
import { useMovements } from '../composables/movements';
import BaseInput from '../components/ui/BaseInput.vue'
import { FunnelIcon, PencilSquareIcon, TrashIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon } from '@heroicons/vue/24/solid'
import { useModalStore } from '../components/modal/store/modalStore';
import Modal from '../components/modal/Modal.vue';
import MovementForm from '../components/MovementForm.vue';
import Pagination from '../components/Pagination.vue';
import { useMovementStore } from '../stores/movementStore';
import { formatoMoneda } from '../constants';
import { Icon } from '@iconify/vue';
import { getRandomBgColor } from './configs/icons';
import { useCategorieStore } from '../stores/categoriesStore';

const modalStore = useModalStore();
const movementStore = useMovementStore();
const categoriesStore = useCategorieStore()

// Control de visibilidad de filtros
const showFilters = ref(false);

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
    selectedCategory,
    selectedType,
    isLoading,
    balance } = useMovements()

watch(() => movementStore.isSaved, async (newVal) => {
    if (newVal) {
        await fetchMovements()
    }
})

onMounted(async () => {
    await categoriesStore.getCategories()
})

</script>

<style scoped>
.filter-slide-enter-active,
.filter-slide-leave-active {
    will-change: max-height;
    transition: max-height 400ms linear;
    max-height: 230px;
    overflow: hidden;
}

.filter-slide-enter-from,
.filter-slide-leave-to {
    max-height: 0;
}
</style>
