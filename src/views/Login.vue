<template>
    <div class="min-h-screen dark:bg-gray-800 bg-gray-100 flex items-center justify-center p-4">
        <div class="w-full max-w-md p-8 dark:bg-gray-800 bg-white rounded-2xl shadow-xl">
            <h2 class="text-3xl font-bold text-center dark:text-white text-gray-800 mb-6">Iniciar sesión</h2>

            <form @submit.prevent="handleLogin" class="space-y-4 dark:bg-gray-800">
                <div>
                    <label class="block text-sm font-medium dark:text-white text-gray-700 mb-1">Usuario</label>
                    <input
                           type="text"
                           v-model="user"
                           required
                           class="w-full px-4 py-2 border dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium dark:text-white text-gray-700 mb-1">Contraseña</label>
                    <input
                           type="password"
                           v-model="password"
                           required
                           class="w-full px-4 py-2 border dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <button
                        type="submit"
                        class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                    Iniciar sesión
                </button>
            </form>

            <p class="mt-4 text-center text-sm text-gray-500">
                ¿No tienes cuenta?
                <router-link to="/register" class="text-blue-600 hover:underline">Regístrate</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { API_BASE_URL } from '../constants/index'
import axios from 'axios'

const user = ref('')
const password = ref('')

const handleLogin = async () => {
    try {
        await axios.post(`${API_BASE_URL}/user/login`,
            {
                user: user.value,
                password: password.value
            },
            { withCredentials: true }
        )

        // Redirigir al dashboard si login es exitoso
        window.location.href = '/'
    } catch (err) {
        alert(err.message)
    }
}
</script>
