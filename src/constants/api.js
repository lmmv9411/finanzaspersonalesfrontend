import axios from 'axios';
import { API_BASE_URL } from '.';

const api = axios.create({
    baseURL: API_BASE_URL
});

// Interceptor para agregar el token en cada request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
