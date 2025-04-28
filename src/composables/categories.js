import axios from "axios";
import { onMounted, ref } from "vue";

const api = 'http://localhost:3000/api/categories';

export function useCategories() {
    const name = ref('');
    const description = ref('');
    const categories = ref([]);

    const getCategories = async () => {
        try {
            const response = await axios.get(api);
            categories.value = response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    const createCategory = async () => {
        try {
            const response = await axios.post(api, {
                name: name.value,
                description: description.value
            });
            console.log('Category created:', response.data);
            // Optionally, you can reset the form fields after successful creation
            name.value = '';
            description.value = '';
            getCategories()
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            const response = await axios.delete(`${api}/${categoryId}`);
            console.log('Category deleted:', response.data);
            getCategories()
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const updateCategory = async (categoryId) => {
        try {
            const response = await axios.put(`${api}/${categoryId}`, {
                name: name.value,
                description: description.value
            });
            console.log('Category updated:', response.data);
            getCategories()
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    onMounted(async () => getCategories());

    return { name, description, categories, createCategory, deleteCategory, updateCategory };

}