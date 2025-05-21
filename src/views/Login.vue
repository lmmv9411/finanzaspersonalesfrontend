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

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../constants/api'

const user = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
    try {
        const resp = await api.post('/user/login',
            {
                user: user.value,
                password: password.value
            }
        )
        
        localStorage.setItem('jwt_token', resp.data.token)

        router.push({ name: 'Home' })

    } catch (err) {
        alert(err.message)
    }

}
</script>
