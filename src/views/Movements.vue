<template>

    <h2 class="mx-auto dark:text-white w-fit text-2xl font-semibold mt-4">Movimientos Registrados</h2>

    <form @submit.prevent="submit"
          class="shadow-md p-2 rounded dark:bg-gray-800 bg-slate-100 flex gap-2 dark:text-gray-300 items-start sm:flex-row sm:items-end sm:w-fit m-auto flex-wrap">

        <div class="flex-1">
            <label for="startDate" class="block text-gray-700 dark:text-gray-300">Fecha Inicio</label>
            <input v-model="dateFormatStart" type="date"
                   class="p-2 border border-gray-300 dark:bg-gray-900 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-300 rounded" />
        </div>
        <div class="flex-1">
            <label for="endDate" class="block text-gray-700 dark:text-gray-300">Fecha Fin</label>
            <input v-model="dateFormatEnd" type="date"
                   class="p-2 border border-gray-300 dark:bg-gray-900 dark:border-gray-700 border-2 focus:border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-300 rounded" />
        </div>

        <button type="submit"
                class="flex gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
            <FunnelIcon class="w-4" />
            <span>Filtrar</span>
        </button>
    </form>

    <div class="w-full max-w-4xl mx-auto p-4 overflow-x-auto">

        <table class="dark:text-white w-full table-auto border-collapse whitespace-nowrap">
            <thead>
                <tr class="border-b border-gray-400">
                    <th class="px-4 py-2">Tipo</th>
                    <th class="px-4 py-2">Monto</th>
                    <th class="px-4 py-2">Descripción</th>
                    <th class="px-4 py-2">Categoría</th>
                    <th class="px-4 py-2">Fecha</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="movement in movementStore.movements" :key="movement.id" class="border-b border-gray-300">
                    <td class="px-4 py-2">
                        <span class="font-bold" :class="{
                            'text-green-600': movement.type === 'ingreso',
                            'text-red-600': movement.type !== 'ingreso'
                        }">{{ movement.type }}</span>
                    </td>
                    <td class="px-4 py-2"
                        :class="{ 'text-green-600': movement.type === 'ingreso', 'text-red-600': movement.type !== 'ingreso' }">
                        {{
                            new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                maximumFractionDigits: 0
                            }).format(movement.type === 'gasto' ? movement.amount * -1 : movement.amount)
                        }}
                    </td>
                    <td class="px-4 py-2">{{ movement.description }}</td>
                    <td class="px-4 py-2">{{ movement.Category?.name }}</td>
                    <td class="px-4 py-2">{{ new Date(movement.createdAt).toLocaleString() }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { FunnelIcon } from '@heroicons/vue/24/solid'
import { useMovements } from '../composables/movements'

const movement = useMovements()

const dateFormatStart = computed({
    get: () => movement.startDate.toISOString().split('T')[0],
    set: (val) => {
        const date = new Date(val)
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
        movement.startDate = date
    }
})

const dateFormatEnd = computed({
    get: () => movement.endDate.toISOString().split('T')[0],
    set: (val) => {
        const date = new Date(val)
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
        movement.endDate = date
    }
})

// cargar movimientos al montar componente
onMounted(() => movement.fetchMovements(true))

const submit = () => movement.fetchMovements()

</script>
