import { storeToRefs } from "pinia";
import { useDateFilters } from "./useDates";
import { useThemeStore } from "./useTheme";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { getAccount } from "../api/accounts";
import { getMovements } from "../api/movements";

export const useAccountsMovements = () => {


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
            const { data } = await getAccount(accountId);

            if (data) {
                account.value = {
                    name: data.name,
                    type: data.type || 'mdi:credit-card-outline',
                    currentBalance: data.currentBalance ?? 0,
                    initialBalance: data.initialBalance ?? 0
                };
            }
        } catch (error) {
            console.error('Error cargando cuenta', error);
        }
    };

    const fetchMovements = async (page = 1) => {
        movements.value = [];
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
                    if (mov.isTransfer || mov.description.startsWith('[AJUSTE]')) {
                        return acc;
                    }
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
            balance.value = (Number(data?.balance ?? 0)) //+ Number(account.value.initialBalance);
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

    return {
        themePlane,
        account,
        movements,
        isLoading,
        currentPage,
        totalPages,
        totalGasto,
        totalIngreso,
        balance,
        fetchMovements,
        selectedMonth,
        router,
        accountId
    };
}