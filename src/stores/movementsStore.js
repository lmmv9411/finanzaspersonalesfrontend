import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { getMovements, deleteMovement as deleteMovementApi } from '../api/movements';
import { useNotifications } from '../composables/useNotifications';
import { useDateFilters } from '../composables/useDates';

export const useMovementsStore = defineStore('movements', () => {

    const { showError, showConfirm, showInfo, showLoading, showSuccess, close } = useNotifications();
    const { selectedMonth, startDate, endDate, resetToCurrentMonth } = useDateFilters();

    const movements = ref([]);
    const totalPages = ref(1);
    const pageSize = 10;
    const currentPage = ref(1);
    const totalGasto = ref(0);
    const totalIngreso = ref(0);
    const balance = ref(0);
    const formatoDia = new Intl.DateTimeFormat(navigator.language, { weekday: 'long' });
    const formatoMes = new Intl.DateTimeFormat(navigator.language, { month: 'long' });
    const selectedType = ref('');
    const selectedCategory = ref(0);
    const isLoading = ref(false);

    const fetchMovements = async (page = 1) => {
        currentPage.value = page;
        movements.value = [];
        isLoading.value = true;

        try {

            const resp = await getMovements({
                startDate: startDate.value,
                endDate: endDate.value,
                page: currentPage.value,
                pageSize,
                type: selectedType.value,
                categoryId: selectedCategory.value || ''
            });

            const { dias } = resp.data;

            movements.value = dias.map(dia => {
                const objDate = new Date(dia.fecha_server);
                dia.dia = objDate.getDate();
                dia.nombreDia = formatoDia.format(objDate);
                dia.mes = formatoMes.format(objDate);

                const { ingresos, gastos } = dia.detalles.reduce((totales, movimiento) => {
                    if (movimiento.type === 'ingreso') {
                        totales.ingresos += Number(movimiento.amount);
                    } else {
                        totales.gastos += Number(movimiento.amount);
                    }
                    return totales;
                }, { ingresos: 0, gastos: 0 });

                dia.ingresos = ingresos;
                dia.gastos = gastos;

                return dia;
            });

            totalGasto.value = resp.data.totalGasto;
            totalIngreso.value = resp.data.totalIngreso;
            balance.value = resp.data.balance;
            totalPages.value = resp.data.totalPages;
        } catch (error) {
            console.error('Error al cargar movimientos', error);
            showError(`Ocurrió un error ${error.status}`, error.response.data.error);
        } finally {
            isLoading.value = false;
        }
    };

    const deleteMovement = async (id) => {
        const { isConfirmed } = await showConfirm('¿Eliminar Movimiento?', 'Eliminar', 'Cancelar');

        if (!isConfirmed) {
            showInfo('No se eliminó!');
            return;
        }

        showLoading('Eliminando...');

        try {
            await deleteMovementApi(id);
            movements.value = movements.value.filter(movement => movement.id !== id);

            for (const dia of movements.value) {
                const idx = dia.detalles.findIndex(mov => mov.id === id);
                if (idx !== -1) {
                    dia.detalles.splice(idx, 1);
                    break;
                }
            }

            showSuccess('Movimiento Eliminado');
        } catch (error) {
            console.error('Error al eliminar movimiento', error);
            showError('Error al eliminar movimiento');
        } finally {
            close();
        }
    };

    const handleReset = () => {
        selectedCategory.value = 0;
        selectedType.value = '';
        resetToCurrentMonth();
    };

    watch([startDate, endDate, selectedCategory, selectedType], () => fetchMovements(), { immediate: true });

    return {
        movements,
        fetchMovements,
        selectedMonth,
        deleteMovement,
        currentPage,
        totalPages,
        totalGasto,
        totalIngreso,
        balance,
        selectedType,
        selectedCategory,
        isLoading,
        handleReset
    };
});