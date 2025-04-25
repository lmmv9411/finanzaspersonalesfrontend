<template>

    <h2 class="mx-auto dark:text-white w-fit text-2xl font-semibold mt-4">Movimientos Registrados</h2>

    <div class="w-full max-w-3xl mx-auto p-4 overflow-x-auto">

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
                        <span :class="{
                            'text-green-600': movement.type === 'ingreso',
                            'text-red-600': movement.type !== 'ingreso'
                        }">{{ movement.type }}</span>
                    </td>
                    <td class="px-4 py-2">
                        {{
                            new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                maximumFractionDigits: 0
                            }).format(movement.amount)
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
import { onMounted } from 'vue'
import { useMovementStore } from '../stores/movementStore'

const movementStore = useMovementStore()

// cargar movimientos al montar componente
onMounted(() => movementStore.fetchMovements())

</script>
