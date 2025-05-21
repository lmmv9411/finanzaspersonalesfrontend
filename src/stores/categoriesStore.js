import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../constants/api";

export const useCategorieStore = defineStore("categories", () => {
    const categories = ref([]);

    const getCategories = async () => {
        try {
            const response = await api.get('/categories');
            categories.value = response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    return { categories, getCategories }
})