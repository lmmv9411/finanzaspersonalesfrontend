<template>
    <header class="flex items-center justify-between bg-gray-800 text-white p-2 shadow-xl">
        <div class="text-xl font-bold">Mis Finanzas</div>
        <button
                @click="$emit('toggleSidebar')"
                class="md:hidden px-4 py-2 bg-blue-500 rounded">
            ☰
        </button>
    </header>
</template>