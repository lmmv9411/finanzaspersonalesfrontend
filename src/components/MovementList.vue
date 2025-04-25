<template>

    <h2 class="mx-auto dark:text-white w-fit text-2xl font-semibold mt-4">Movimientos Registrados</h2>

    <form @submit.prevent="submit" class="flex gap-2 dark:text-gray-300 items-start flex-col sm:flex-row sm:items-end">

        <div class="w-full">
            <label for="startDate" class="block text-gray-700 dark:text-gray-300">Fecha Inicio</label>
            <input v-model="dateFormatStart" type="date"
                   class="dark:bg-gray-900 dark:border-gray-700 border-2 rounded p-1" />
        </div>
        <div class="w-full">
            <label for="endDate" class="block text-gray-700 dark:text-gray-300">Fecha Fin</label>
            <input v-model="dateFormatEnd" type="date"
                   class="dark:bg-gray-900 dark:border-gray-700 border-2 rounded p-1" />
        </div>

        <button type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">Filtrar</button>
    </form>

    <div class="w-full max-w-4xl mx-auto p-4 overflow-x-auto">

        <table class="dark:text-white w-full table-auto border-collapse whitespace-nowrap">
            <thead>
                <tr class="border-b dark:border-gray-300">
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
import { useMovementStore } from '../stores/movementStore'

const movementStore = useMovementStore()

const dateFormatStart = computed({
    get: () => movementStore.startDate.toISOString().split('T')[0],
    set: (val) => {
        const date = new Date(val)
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
        movementStore.startDate = date
    }
})

const dateFormatEnd = computed({
    get: () => movementStore.endDate.toISOString().split('T')[0],
    set: (val) => {
        const date = new Date(val)
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
        movementStore.endDate = date
    }
})

// cargar movimientos al montar componente
onMounted(() => movementStore.fetchMovements())

const submit = () => movementStore.fetchMovements()

</script>
