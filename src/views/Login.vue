<template>

    <div class="dark:bg-gray-800 bg-gray-100 flex items-center justify-center p-4 h-full">

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

                <BaseButton type="submit" color="success" class="w-full">Iniciar Sesión</BaseButton>
            </form>

        </div>
    </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import api from '../constants/api'

const user = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
    try {

        Swal.fire({
            title: 'Iniciando Sesión...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
            theme: 'auto'
        })

        const resp = await api.post('/user/login',
            {
                user: user.value,
                password: password.value
            }
        )

        Swal.close()

        localStorage.setItem('jwt_token', resp.data.token)

        router.push({ name: 'Home' })

    } catch (err) {
        console.error(err)
        Swal.fire({
            title: err,
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
            theme: 'auto'
        });
    }

}
</script>
