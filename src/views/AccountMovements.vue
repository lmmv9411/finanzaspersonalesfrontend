<template>
    <div class="container mx-auto max-w-3xl py-4 px-2">
        <div class="flex items-center justify-between mb-4">
            <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <span class="rounded-full p-1 text-2xl text-white bg-indigo-500"
                          :class="getRandomBgColor(account.type)"
                          v-if="account.type">
                        <Icon :icon="account.type" />
                    </span>
                    {{ account.name || `Cuenta #${accountId}` }}
                </p>
            </div>
            <BaseButton color="secondary" @click="router.back()">Volver</BaseButton>
        </div>

        <div class="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mes:</label>
            <VueDatePicker
                           month-picker
                           v-model="selectedMonth"
                           format="MMMM yyyy"
                           :dark="themePlane === 'dark'"
                           :format-locale="es" />
        </div>

        <div class="mb-6 p-2 sm:p-3 dark:bg-gray-800 bg-blue-50 rounded-lg">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                <div class="rounded-lg bg-white/90 dark:bg-gray-900 p-2 sm:p-3 text-center">
                    <span class="text-[11px] sm:text-xs text-cyan-700 dark:text-cyan-300 font-semibold block">
                        Saldo Inicial
                    </span>
                    <span class="text-sm sm:text-base font-bold text-cyan-700 dark:text-cyan-300 break-words">{{
                        formatoMoneda(account.initialBalance) }}</span>
                </div>

                <div class="rounded-lg bg-white/90 dark:bg-gray-900 p-2 sm:p-3 text-center">
                    <span
                          class="text-[11px] sm:text-xs text-green-600 dark:text-green-400 font-semibold block">Ingresos</span>
                    <span class="text-sm sm:text-base font-bold text-green-600 dark:text-green-400 break-words">{{
                        formatoMoneda(totalIngreso) }}</span>
                </div>

                <div class="rounded-lg bg-white/90 dark:bg-gray-900 p-2 sm:p-3 text-center">
                    <span
                          class="text-[11px] sm:text-xs text-red-600 dark:text-red-400 font-semibold block">Gastos</span>
                    <span class="text-sm sm:text-base font-bold text-red-600 dark:text-red-400 break-words">{{
                        formatoMoneda(totalGasto) }}</span>
                </div>

                <div class="rounded-lg bg-white/90 dark:bg-gray-900 p-2 sm:p-3 text-center">
                    <span
                          class="text-[11px] sm:text-xs text-indigo-700 dark:text-indigo-200 font-semibold block">Saldo</span>
                    <span class="text-sm sm:text-base font-bold text-indigo-700 dark:text-indigo-200 break-words">{{
                        formatoMoneda(balance) }}</span>
                </div>
            </div>
        </div>

        <div v-if="isLoading" class="min-h-[200px] flex items-center justify-center">
            <span class="text-gray-600 dark:text-gray-300">Cargando movimientos...</span>
        </div>

        <div v-else-if="movements.length === 0" class="text-center py-8 text-gray-500">
            No hay movimientos para esta cuenta en este período
        </div>

        <div v-else>
            <div v-for="dia in movements" :key="dia.fecha_server" class="mb-6">
                <div class="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
                    <h3 class="text-xs sm:text-base dark:text-gray-200">{{ dia.nombreDia }}, {{ dia.dia }} de {{ dia.mes
                    }}</h3>
                    <div class="flex gap-2 text-xs sm:text-base">
                        <span v-if="dia.ingresos > 0" class="text-green-600 dark:text-green-400">{{
                            formatoMoneda(dia.ingresos) }}</span>
                        <span v-if="dia.gastos > 0" class="text-red-600 dark:text-red-400">{{ formatoMoneda(dia.gastos)
                        }}</span>
                    </div>
                </div>

                <div class="border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
                    <div v-for="mov in dia.detalles" :key="mov.id" class="p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div class="flex justify-between items-center">
                            <div class="flex flex-col gap-3">
                                <div class="flex gap-3 items-center">
                                    <div class="text-sm text-gray-500 mt-1">
                                        <ArrowsRightLeftIcon class="w-6 text-indigo-500" />
                                    </div>
                                    <p class="font-medium dark:text-gray-100">{{ mov.description }}</p>
                                </div>


                                <div class="flex gap-2 items-center text-sm text-gray-500 dark:text-gray-400">

                                    <ArrowTrendingUpIcon v-if="mov.type === 'ingreso'" class="w-6 text-green-500" />
                                    <ArrowTrendingDownIcon v-else class="w-6 text-red-500" />

                                    <div :class=[getRandomBgColor(mov.Transfer?.toAccount?.type)]
                                         class="rounded-full p-1 text-white text-lg">
                                        <Icon :icon="mov.Transfer?.toAccount?.type" />
                                    </div>
                                    <span>{{ mov.Transfer.toAccount.name }}</span>
                                    <span>•</span>
                                    <span>{{ mov.type }}</span>
                                </div>

                            </div>

                            <span
                                  class="text-blue-600 dark:text-blue-400">
                                {{ formatoMoneda(mov.amount) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Pagination
                    v-if="totalPages > 1"
                    :currentPage="currentPage"
                    :totalPages="totalPages"
                    @page-changed="fetchMovements" />
    </div>
</template>

<script setup>
import { ArrowsRightLeftIcon, ArrowTrendingDownIcon, ArrowTrendingUpIcon } from '@heroicons/vue/24/solid';
import { Icon } from '@iconify/vue';
import { es } from 'date-fns/locale';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAccounts } from '../api/accounts';
import { getMovements } from '../api/movements';
import Pagination from '../components/Pagination.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import { useDateFilters } from '../composables/useDates';
import { useThemeStore } from '../composables/useTheme';
import { formatoMoneda } from '../constants';
import { getRandomBgColor } from './configs/icons';

const { themePlane } = storeToRefs(useThemeStore());
const { selectedMonth, startDate, endDate, getTimezoneOffsetString } = useDateFilters();
const route = useRoute();
const router = useRouter();

const accountId = Number(route.params.id);
const pageSize = 10;
const tz = getTimezoneOffsetString();

const account = ref({ name: '', type: '' });
const movements = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const totalGasto = ref(0);
const totalIngreso = ref(0);
const balance = ref(0);

const formatoDia = new Intl.DateTimeFormat(navigator.language, { weekday: 'long' });
const formatoMes = new Intl.DateTimeFormat(navigator.language, { month: 'long' });
const camelCase = (str) => str.replace(/^\w/, (c) => c.toUpperCase());

const loadAccount = async () => {
    try {
        const { data } = await getAccounts();
        const list = Array.isArray(data) ? data : (data.accounts ?? []);
        const found = list.find((item) => Number(item.id) === accountId);
        if (found) {
            account.value = {
                name: found.name,
                type: found.type || 'mdi:credit-card-outline',
                currentBalance: found.currentBalance ?? 0,
                initialBalance: found.initialBalance ?? 0
            };
        }
    } catch (error) {
        console.error('Error cargando cuenta', error);
    }
};

const fetchMovements = async (page = 1) => {
    currentPage.value = page;
    isLoading.value = true;

    try {
        const { data } = await getMovements({
            startDate: startDate.value,
            endDate: endDate.value,
            page,
            pageSize,
            AccountId: accountId,
            tz
        });

        const dias = data?.dias ?? [];

        movements.value = dias.map((dia) => {
            const objDate = new Date(dia.fecha_server);
            const totals = dia.detalles.reduce((acc, mov) => {
                if (mov.type === 'ingreso') acc.ingresos += Number(mov.amount);
                else acc.gastos += Number(mov.amount);
                return acc;
            }, { ingresos: 0, gastos: 0 });

            return {
                ...dia,
                dia: objDate.getDate(),
                nombreDia: camelCase(formatoDia.format(objDate)),
                mes: camelCase(formatoMes.format(objDate)),
                ingresos: totals.ingresos,
                gastos: totals.gastos
            };
        });

        totalGasto.value = Number(data?.totalGasto ?? 0);
        totalIngreso.value = Number(data?.totalIngreso ?? 0);
        balance.value = (Number(data?.balance ?? 0)) + Number(account.value.initialBalance);
        totalPages.value = Number(data?.totalPages ?? 1);
    } catch (error) {
        console.error('Error al cargar movimientos por cuenta', error);
        movements.value = [];
    } finally {
        isLoading.value = false;
    }
};

watch([startDate, endDate], () => fetchMovements(1));

onMounted(async () => {
    await loadAccount();
    await fetchMovements();
});
</script>
