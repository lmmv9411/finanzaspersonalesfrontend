<template>
    <div class="min-w-xs mx-auto mt-10 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 text-center">{{ user?.name + ' ' +
            user?.lastName }}</h2>

        <div class="flex flex-col items-center gap-4">
            <div class="relative">
                <img
                     :src="preview || profileUrl"
                     alt="Foto de perfil"
                     class="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600 shadow" />


                <input
                       ref="fileInput"
                       type="file"
                       accept="image/*"
                       class="hidden"
                       @change="onFileChange" />

                <Icon icon="mdi:edit"
                      @click="triggerFileInput"
                      class="cursor-pointer w-6 h-6 text-gray-500 dark:text-white absolute -top-2 -right-2 hover:text-indigo-500 shadow:lg transition duration-300 " />
            </div>
            <BaseButton
                        @click="uploadImage"
                        :disabled="!selectedFile || uploading">
                {{ uploading ? 'Subiendo...' : 'Guardar' }}
            </BaseButton>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import { BASE_URL } from '../constants';
import api from '../constants/api';
import BaseButton from './ui/BaseButton.vue';
import { useUserStore } from '../stores/userStore';
import { storeToRefs } from 'pinia';

const fileInput = ref(null);
const selectedFile = ref(null);
const uploading = ref(false);
const preview = ref(null);

const { user, profileUrl } = storeToRefs(useUserStore());

function triggerFileInput() {
    fileInput.value.click();
}

function onFileChange(e) {
    const file = e.target.files[0];
    if (file) {
        selectedFile.value = file;
        preview.value = URL.createObjectURL(file);
    }
}

async function uploadImage() {
    if (!selectedFile.value) return;

    uploading.value = true;
    const formData = new FormData();
    formData.append('image', selectedFile.value);

    try {
        const { data } = await api.post('/user/upload-profile-pic',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )

        if (data.url) {
            profileUrl.value = `${BASE_URL}${data.url}`;
            preview.value = null;
            selectedFile.value = null;
        } else {
            Swal.fire({
                title: "Error al subir foto",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
                theme: 'auto'
            });
        }
    } catch (err) {
        console.error(err);
        Swal.fire({
            title: "Error al subir foto",
            text: err.response.data.error,
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
            theme: 'auto'
        });
    } finally {
        uploading.value = false;
    }
}

</script>
