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
            const response = await api.post('/categories', {
                name: name.value
            });
            console.log('Category created:', response.data);

            name.value = '';
            categoriesStore.getCategories()
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            const response = await api.delete(`/categories/${categoryId}`);
            console.log('Category deleted:', response.data);
            categoriesStore.getCategories()
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const onUpdateCategory = (categoryId) => {

        const idx = categoriesStore.categories.value.findIndex(categorie => categorie.id === categoryId);

        if (idx === -1) return

        name.value = categoriesStore.categories.value[idx].name;
        categoriesStore.categories.value.splice(idx, 1);
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