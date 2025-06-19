<template>
    <div class="flex flex-col gap-4 items-center">

        <ProfilePictureUploader />

        <BaseButton @click="logout" class="flex gap-2 items-center sm:hidden">
            <ArrowRightStartOnRectangleIcon class="w-5 h-5 inline-block" />
            <span>Cerrar Sesión</span>
        </BaseButton>

        <ToggleTheme class="sm:hidden" />
    </div>
</template>

<script setup>
import { ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/outline';
import ProfilePictureUploader from '../../components/ProfilePictureUploader.vue'
import BaseButton from '../../components/ui/BaseButton.vue';
import ToggleTheme from '../../components/ToggleTheme.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
    /*await api.post('/user/logout')
    router.push({ name: 'Login' })*/
    localStorage.removeItem('jwt_token')
    router.push({ name: 'Login' })
}

</script>