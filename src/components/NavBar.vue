<template>
    <header class="flex items-center justify-between bg-blue-600 text-white p-2">
        <div class="text-xl font-bold">Mi Dashboard</div>
        <button
                @click="$emit('toggleSidebar')"
                class="md:hidden p-2 bg-blue-500 rounded">
            ☰
        </button>
    </header>
</template>