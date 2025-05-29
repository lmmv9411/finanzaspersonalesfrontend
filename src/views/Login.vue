<template>

    <div class="dark:bg-gray-800 bg-gray-100 flex items-center justify-center p-4 h-dvh">

        <div class="w-full max-w-md p-8 dark:bg-gray-800 bg-white rounded-2xl shadow-xl/30">

            <h2 class="text-3xl font-bold text-center dark:text-white text-gray-800 mb-6">Iniciar sesión</h2>

            <form @submit.prevent="handleLogin" class="space-y-4 dark:bg-gray-800">
                <div>
                    <label class="block text-sm font-medium dark:text-white text-gray-700 mb-1">Usuario</label>
                    <BaseInput v-model="user" required id="user" />
                </div>

                <div>
                    <label class="block text-sm font-medium dark:text-white text-gray-700 mb-1">Contraseña</label>
                    <BaseInput v-model="password" type="password" required id="password" />
                </div>

                <BaseButton type="submit" class="w-full">Iniciar Sesión</BaseButton>
            </form>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../constants/api'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'

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
        debugger
        alert(err.message)
    }

}
</script>
