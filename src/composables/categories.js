import { onMounted, ref } from "vue";
import api from "../constants/api";

export function useCategories() {
    const name = ref('');
    const categories = ref([]);
    const isUpdate = ref(false);
    let idUpdate = null;

    const getCategories = async () => {
        try {
            const response = await api.get('/categories');
            categories.value = response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

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
            getCategories()
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            const response = await api.delete(`/categories/${categoryId}`);
            console.log('Category deleted:', response.data);
            getCategories()
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const onUpdateCategory = (categoryId) => {

        const idx = categories.value.findIndex(categorie => categorie.id === categoryId);

        if (idx === -1) return

        name.value = categories.value[idx].name;
        categories.value.splice(idx, 1);
        isUpdate.value = true;
        idUpdate = categoryId;

    }

    const updateCategory = async (categoryId) => {
        try {
            const response = await api.put(`/categories/${categoryId}`, {
                name: name.value
            });
            console.log('Category updated:', response.data);
            getCategories()
            isUpdate.value = false;
            idUpdate = null;
            name.value = '';
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    onMounted(async () => getCategories());

    return { name, categories, createCategory, deleteCategory, updateCategory, onUpdateCategory, isUpdate, getCategories };

}