import api from "../constants/api";
import { onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";

export const useMovements = () => {

    const movements = ref([])
    const selectedMonth = ref('')
    const startDate = ref('')
    const endDate = ref('')

    const totalPages = ref(1)
    const pageSize = 10
    const currentPage = ref(1)
    const totalGasto = ref(0)
    const totalIngreso = ref(0)
    const balance = ref(0)
    const formatoDia = new Intl.DateTimeFormat(navigator.language, { weekday: 'long' })
    const formatoMes = new Intl.DateTimeFormat(navigator.language, { month: 'long' })
    const selectedType = ref('');
    const selectedCategory = ref({ CategoryId: '' });
    const isLoading = ref(false)

    const fetchMovements = async (page = 1) => {

        currentPage.value = page
        movements.value = []
        isLoading.value = true

        try {
            const resp = await api.get(`/movements/day?startDate=${startDate.value}&endDate=${endDate.value}&page=${currentPage.value}&pageSize=${pageSize}&type=${selectedType.value}&categoryId=${selectedCategory.value.CategoryId}`);

            const { dias } = resp.data

            movements.value = dias.map(mov => {

                const objDate = new Date(mov.fecha_server)

                mov.dia = objDate.getDate()
                mov.nombreDia = formatoDia.format(objDate)
                mov.mes = formatoMes.format(objDate)

                const { ingresos, gastos } = mov.detalles.reduce((totales, movimiento) => {
                    if (movimiento.type === 'ingreso') {
                        totales.ingresos += Number(movimiento.amount);
                    } else {
                        totales.gastos += Number(movimiento.amount);
                    }
                    return totales;
                }, { ingresos: 0, gastos: 0 })

                mov.ingresos = ingresos
                mov.gastos = gastos

                return mov
            })

            totalGasto.value = resp.data.totalGasto
            totalIngreso.value = resp.data.totalIngreso
            balance.value = resp.data.balance
            totalPages.value = resp.data.totalPages
        } catch (error) {
            console.error('Error al cargar movimientos', error)
            Swal.fire({
                title: 'Ocurrió un error ' + error.status,
                text: error.response.data.error,
                icon: 'error',
                theme: 'auto',
                timer: 3500,
                showConfirmButton: false,
                timerProgressBar: true,
                toast: true,
                position: 'top'

            })
        } finally {
            isLoading.value = false
        }
    }

    const deleteMovement = async (id) => {


        const result = await Swal.fire({
            title: "Eliminar Movimiento?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            theme: 'auto'
        })

        if (!result.isConfirmed) {
            Swal.fire({
                title: "No se eliminó!",
                icon: "info",
                timer: 2000,
                theme: 'auto',
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timerProgressBar: true
            });
            return
        }

        Swal.fire({
            title: 'Eliminando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
            theme: 'auto'
        })

        try {

            await api.delete(`/movements/${id}`);
            movements.value = movements.value.filter(movement => movement.id !== id)

            for (const dia of movements.value) {
                const idx = dia.detalles.findIndex(mov => mov.id === id)
                if (idx !== -1) {
                    dia.detalles.splice(idx, 1)
                    break
                }
            }

            Swal.fire({
                title: "Movimiento Eliminado",
                icon: "success",
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                theme: 'auto'
            });
        } catch (error) {
            console.error('Error al eliminar movimiento', error)
            Swal.fire({
                title: "Error al eliminar movimiento",
                icon: "error",
                toast: true,
                position: "top",
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
                theme: 'auto'
            });
        }
    }

    const getCurrentMonth = function () {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        startDate.value = `${year}-${month}-01`;
        endDate.value = new Date(year, month, 0).toISOString().split('T')[0];
        selectedMonth.value = `${year}-${month}`
    }

    const handleReset = () => {
        selectedCategory.value.CategoryId = ''
        selectedType.value = ''
        getCurrentMonth()
    }

    watch(selectedMonth, (newValue) => {
        const [year, month] = newValue.split('-')
        startDate.value = `${year}-${month}-01 00:00:00`
        endDate.value = new Date(year, month, 0).toISOString().split('T')[0] + ' 23:59:59'
        fetchMovements()
    })

    watch([selectedCategory, selectedType], () => fetchMovements(), { deep: true })

    onMounted(() => getCurrentMonth())

    return {
        movements,
        fetchMovements,
        selectedMonth,
        deleteMovement,
        currentPage,
        totalPages,
        fetchMovements,
        totalGasto,
        totalIngreso,
        balance,
        selectedType,
        selectedCategory,
        isLoading,
        handleReset
    }
}