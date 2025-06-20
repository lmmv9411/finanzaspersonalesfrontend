<template>
    <div class="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Cambiar Contraseña</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Contraseña Actual -->
            <div>
                <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contraseña Actual
                </label>
                <div class="relative">
                    <BaseInput
                               v-model="currentPassword"
                               :type="showCurrentPassword ? 'text' : 'password'"
                               id="currentPassword"
                               required />
                    <button
                            type="button"
                            @click="showCurrentPassword = !showCurrentPassword"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-500 focus:outline-none focus:text-gray-300 dark:focus:text-white">
                        <EyeIcon v-if="showCurrentPassword" class="h-5 w-5" />
                        <EyeSlashIcon v-else class="h-5 w-5" />
                    </button>
                </div>
            </div>

            <!-- Nueva Contraseña -->
            <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nueva Contraseña
                </label>
                <div class="relative">
                    <BaseInput
                               v-model="newPassword"
                               :type="showNewPassword ? 'text' : 'password'"
                               id="newPassword"
                               required
                               @input="validatePassword" />
                    <button
                            type="button"
                            @click="showNewPassword = !showNewPassword"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-500 focus:outline-none focus:text-gray-300 dark:focus:text-white">
                        <EyeIcon v-if="showNewPassword" class="h-5 w-5" />
                        <EyeSlashIcon v-else class="h-5 w-5" />
                    </button>
                </div>
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    La contraseña debe contener al menos:
                    <ul class="list-disc list-inside">
                        <li :class="{ 'text-green-500': hasMinLength }">8 caracteres</li>
                        <li :class="{ 'text-green-500': hasNumber }">1 número</li>
                        <li :class="{ 'text-green-500': hasSpecialChar }">1 carácter especial</li>
                    </ul>
                </div>
            </div>

            <!-- Confirmar Nueva Contraseña -->
            <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirmar Nueva Contraseña
                </label>
                <div class="relative">
                    <BaseInput
                               v-model="confirmPassword"
                               :type="showConfirmPassword ? 'text' : 'password'"
                               id="confirmPassword"
                               required />
                    <button
                            type="button"
                            @click="showConfirmPassword = !showConfirmPassword"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-gray-500 dark:text-gray-500 focus:outline-none focus:text-gray-300 dark:focus:text-white">
                        <EyeIcon v-if="showConfirmPassword" class="h-5 w-5" />
                        <EyeSlashIcon v-else class="h-5 w-5" />
                    </button>
                </div>
                <p v-if="!passwordsMatch && confirmPassword" class="mt-1 text-sm text-red-500">
                    Las contraseñas no coinciden
                </p>
            </div>

            <!-- Botón de enviar -->
            <div class="pt-2">
                <button
                        type="submit"
                        :disabled="isSubmitting || !isFormValid"
                        class="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    <span v-if="isSubmitting">
                        <svg class="animate-spin h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Procesando...
                    </span>
                    <span v-else>
                        Cambiar Contraseña
                    </span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'
import BaseInput from '../../components/ui/BaseInput.vue'

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Validaciones
const hasMinLength = computed(() => newPassword.value.length >= 8)
const hasNumber = computed(() => /\d/.test(newPassword.value))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(newPassword.value))
const passwordsMatch = computed(() => newPassword.value === confirmPassword.value)

const isPasswordValid = computed(() => {
    return hasMinLength.value && hasNumber.value && hasSpecialChar.value
})

const isFormValid = computed(() => {
    return (
        currentPassword.value &&
        newPassword.value &&
        confirmPassword.value &&
        isPasswordValid.value &&
        passwordsMatch.value
    )
})

const validatePassword = () => {
    // Solo para disparar las computadas
}

const handleSubmit = async () => {
    if (!isFormValid.value) return

    isSubmitting.value = true

    try {
        // Aquí iría tu llamada API para cambiar la contraseña
        // await changePassword(currentPassword.value, newPassword.value)

        // Simulamos un retraso de red
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Resetear el formulario después del éxito
        currentPassword.value = ''
        newPassword.value = ''
        confirmPassword.value = ''

        // Mostrar mensaje de éxito (puedes usar un toast o alert)
        alert('Contraseña cambiada con éxito!')
    } catch (error) {
        console.error('Error al cambiar contraseña:', error)
        alert('Hubo un error al cambiar la contraseña. Por favor intenta nuevamente.')
    } finally {
        isSubmitting.value = false
    }
}
</script>