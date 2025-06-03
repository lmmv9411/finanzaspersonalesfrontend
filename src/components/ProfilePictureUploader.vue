<template>
    <div class="max-w-sm mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 text-center">Subir Foto de Perfil</h2>

        <div class="flex flex-col items-center gap-4">
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

            <button
                    @click="triggerFileInput"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Seleccionar imagen
            </button>

            <button
                    @click="uploadImage"
                    :disabled="!selectedFile || uploading"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition">
                {{ uploading ? 'Subiendo...' : 'Guardar' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../constants/api'

const profileUrl = ref('http://192.168.1.66:3000/uploads/default.jpg');
const fileInput = ref(null);
const selectedFile = ref(null);
const preview = ref(null);
const uploading = ref(false);

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
    formData.append('image', selectedFile.value); // Este nombre debe coincidir con upload.single('image')

    try {
        const { data } = await api.post('/user/upload-profile-pic',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )

        if (data.url) {
            profileUrl.value = 'http://192.168.1.66:3000' + data.url;
            preview.value = null;
            selectedFile.value = null;
        } else {
            alert('Error al subir la imagen');
        }
    } catch (err) {
        console.error(err);
        alert('Ocurrió un error');
    } finally {
        uploading.value = false;
    }
}

onMounted(async () => {
    const { data } = await api.get('/user')
    profileUrl.value = 'http://192.168.1.66:3000' + data.profilePicture
})

</script>

<style scoped></style>
