<template>
    <section class="px-4 py-5 max-w-3xl mx-auto dark:text-gray-100">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold">Cuentas</h2>
            <BaseButton @click="toggleForm" class="flex items-center gap-2">
                <PlusIcon class="w-5 h-5" />
                <span>{{ showForm ? 'Cerrar' : 'Nueva cuenta' }}</span>
            </BaseButton>
        </div>

        <Transition name="slide-cuenta">
            <form
                  v-if="showForm"
                  @submit.prevent="handleSubmit"
                  class="mb-6 p-4 rounded-lg shadow bg-slate-100 dark:bg-gray-800 space-y-3">
                <div>
                    <label class="block mb-1 text-sm">Nombre</label>
                    <BaseInput v-model.trim="form.name" required placeholder="Ej: Bancolombia" />
                </div>

                <div>
                    <label class="block mb-1 text-sm">Saldo inicial</label>
                    <BaseInput v-model="formattedAmount" @input="handleAmountInput" type="tel" placeholder="$0" />
                </div>

                <div>
                    <label class="block mb-1 text-sm">Ícono de cuenta</label>
                    <BaseButton color="none" @click="showIconPicker = !showIconPicker"
                                class="flex items-center gap-2 p-2 border rounded dark:border-gray-500">

                        <div class="rounded-full p-2 w-8 h-8 flex items-center justify-center shadow-xl"
                             :class="[getRandomBgColor(form.type)]">
                            <Icon :icon="form.type" class="w-6 h-6 text-white" />
                        </div>

                        <!---<span class="dark:text-gray-100">{{ selectedIconName && 'Seleccionar ícono' }}</span>-->
                    </BaseButton>
                </div>

                <div class="flex items-center gap-2 justify-end">
                    <BaseButton color="danger" type="button" @click="resetForm">
                        <ArrowPathIcon class="w-5 h-5" />
                    </BaseButton>
                    <BaseButton type="submit" class="flex items-center gap-2">
                        <span>{{ isEdit ? 'Actualizar' : 'Guardar' }}</span>
                        <PencilSquareIcon v-if="isEdit" class="w-5 h-5" />
                        <CheckCircleIcon v-else class="w-5 h-5" />
                    </BaseButton>
                </div>
            </form>
        </Transition>

        <IconPickerSolid v-if="showIconPicker" @selected="handleIconSelected" @close="showIconPicker = false" />

        <div class="grid sm:grid-cols-2 gap-3">
            <article
                     v-for="account in accounts"
                     :key="account.id"
                     @click.stop="goToAccountMovements(account.id)"
                     class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm bg-white dark:bg-gray-900 cursor-pointer hover:shadow-lg transition duration-500">
                <div class="flex justify-between items-start gap-2">
                    <div>
                        <div class="font-semibold text-lg flex items-center gap-2">
                            <div class="rounded-full p-1 text-white text-lg" :class="[getRandomBgColor(account.type)]">
                                <Icon :icon="account.type" />
                            </div>
                            <h3>{{ account.name }}</h3>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Saldo: {{ formatoMoneda(account.balance) }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Gastos: {{ formatoMoneda(account.totalGasto)
                            }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Ingresos: {{
                            formatoMoneda(account.totalIngreso) }}
                        </p>
                    </div>
                    <div class="flex gap-1">
                        <button @click.stop="startEdit(account)" title="Editar"
                                class="text-blue-500 hover:text-blue-600 cursor-pointer">
                            <PencilSquareIcon class="w-5 h-5" />
                        </button>
                        <button @click.stop="removeAccount(account.id)" title="Eliminar"
                                class="text-red-500 hover:text-red-600 cursor-pointer">
                            <TrashIcon class="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </article>
        </div>

        <p v-if="!accounts.length" class="text-gray-500 dark:text-gray-400 text-sm">No tienes cuentas registradas.</p>
    </section>
</template>

<script setup>
import { ArrowPathIcon, CheckCircleIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { Icon } from '@iconify/vue';
import { onMounted } from 'vue';
import IconPickerSolid from '../components/IconPickerSolid.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import { formatoMoneda } from '../constants';
import { getRandomBgColor } from './configs/icons';
import { useAccounts } from '../composables/accounts';

const {
    fetchAccounts,
    accounts,
    form,
    isEdit,
    showForm,
    toggleForm,
    resetForm,
    handleSubmit,
    handleIconSelected,
    handleAmountInput,
    startEdit,
    removeAccount,
    showIconPicker,
    goToAccountMovements,
    formattedAmount
} = useAccounts()

onMounted(fetchAccounts);

</script>

<style scoped>
.slide-cuenta-enter-active,
.slide-cuenta-leave-active {
    transition: all 0.25s ease;
}

.slide-cuenta-enter-from,
.slide-cuenta-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
