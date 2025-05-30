import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import api from "../constants/api";
import { useCategorieStore } from "../stores/categoriesStore";

export function useCategories() {
    const name = ref('');
    const isUpdate = ref(false);
    let idUpdate = null;
    const categoriesStore = useCategorieStore()

    const createCategory = async () => {

        if (isUpdate.value) {
            updateCategory(idUpdate)
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

            Swal.fire({
                title: 'Creando...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                },
                theme: 'auto'
            })

            await api.post('/categories', { name: name.value });

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

            name.value = '';
            categoriesStore.getCategories()
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

    const onUpdateCategory = (categoryId) => {

        const idx = categoriesStore.categories.findIndex(categorie => categorie.id === categoryId);

        if (idx === -1) return

        name.value = categoriesStore.categories[idx].name;
        categoriesStore.categories.splice(idx, 1);
        isUpdate.value = true;
        idUpdate = categoryId;

    }

    const updateCategory = async (categoryId) => {
        try {
            const response = await api.put(`/categories/${categoryId}`, {
                name: name.value
            });
            console.log('Category updated:', response.data);
            categoriesStore.getCategories()
            isUpdate.value = false;
            idUpdate = null;
            name.value = '';
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    onMounted(async () => categoriesStore.getCategories());

    return { name, createCategory, deleteCategory, updateCategory, onUpdateCategory, isUpdate };

}