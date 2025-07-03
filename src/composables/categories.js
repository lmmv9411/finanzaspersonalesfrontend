import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import api from "../constants/api";
import { useCategorieStore } from "../stores/categoriesStore";

export function useCategories() {
    const name = ref('');
    const type = ref('ingreso');
    const isUpdate = ref(false);
    const categoryUpdate = ref(null);
    const categoriesStore = useCategorieStore()
    const selectedIcon = ref({});
    const handleIconSelected = (icon) => selectedIcon.value = icon;
    const showIconPicker = ref(false)

    const createCategory = async () => {

        if (isUpdate.value) {
            updateCategory()
            return
        }

        try {

            if (name.value === '') {
                Swal.fire({
                    title: "Nombre Vacío",
                    icon: "error",
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    theme: 'auto'
                });
                return;
            }

            if (!selectedIcon.value.icon) {
                Swal.fire({
                    title: "Ícono Vacío",
                    icon: "error",
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    theme: 'auto'
                });
                return;
            }

            Swal.fire({
                title: 'Creando...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                },
                theme: 'auto'
            })

            await api.post('/categories', { name: name.value, icon: selectedIcon.value.icon, type: type.value })

            Swal.fire({
                title: "Categoria Creada",
                icon: "success",
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                theme: 'auto'
            });

            reset()

        } catch (error) {
            console.error('Error creating category:', error);
            Swal.fire({
                title: "Error al crear categoria",
                text: error.response.data.error,
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
                theme: 'auto'
            });
        }

    };

    const deleteCategory = async (categoryId) => {
        try {

            const result = await Swal.fire({
                title: "Eliminar Categoria?",
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

            await api.delete(`/categories/${categoryId}`);

            categoriesStore.getCategories()

            Swal.fire({
                title: "Categoria Eliminada",
                icon: "success",
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                theme: 'auto'
            });

        } catch (error) {
            console.error('Error deleting category:', error);
            Swal.fire({
                title: "Error al eliminar categoria",
                text: error.response.data.error,
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
                theme: 'auto'
            });
        }
    };

    const reset = () => {
        categoriesStore.getCategories()
        isUpdate.value = false;
        categoryUpdate.value = null;
        name.value = '';
        selectedIcon.value.icon = null
        selectedIcon.value.name = ''
        showIconPicker.value = false
    }

    const onUpdateCategory = (category) => {

        const idx = categoriesStore.categories.findIndex(categorie => categorie.id === category.id);

        if (idx === -1) return

        name.value = categoriesStore.categories[idx].name;
        categoriesStore.categories.splice(idx, 1);
        isUpdate.value = true;
        categoryUpdate.value = category;
        selectedIcon.value.icon = category.icon
        type.value = category.type
    }

    const updateCategory = async () => {
        try {
            await api.put(`/categories/${categoryUpdate.value.id}`, {
                name: name.value,
                icon: selectedIcon.value.icon,
                type: type.value
            });
        } catch (error) {
            console.error('Error updating category:', error);
        }
        reset()
    };

    onMounted(async () => categoriesStore.getCategories());

    return { name, type, createCategory, deleteCategory, updateCategory, onUpdateCategory, isUpdate, selectedIcon, handleIconSelected, reset, showIconPicker };

}