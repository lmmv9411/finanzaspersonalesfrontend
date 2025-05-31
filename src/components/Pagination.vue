<template>
    <div class="flex items-center justify-between mt-6">
        
        <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="cursor-pointer p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <ArrowLeftIcon class="w-5" />
        </button>

        <div class="flex items-center space-x-2">
            <template v-for="page in visiblePages" :key="page">
                <button
                        @click="goToPage(page)"
                        :class="{
                            'px-4 py-2 text-sm font-medium rounded-md cursor-pointer': true,
                            'bg-blue-600 text-white': currentPage === page,
                            'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50': currentPage !== page
                        }">
                    {{ page }}
                </button>
            </template>

        </div>

        <button @click="nextPage" :disabled="currentPage === totalPages"
                class="cursor-pointer p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <ArrowRightIcon class="w-5"/>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/16/solid';

const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    },
    maxVisiblePages: {
        type: Number,
        default: 5
    }
});

const emit = defineEmits(['page-changed']);

const visiblePages = computed(() => {

    const start = props.currentPage - ((props.currentPage - 1) % props.maxVisiblePages)
    const end = Math.min(start + props.maxVisiblePages - 1, props.totalPages)

    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

function prevPage() {
    if (props.currentPage > 1) {
        emit('page-changed', props.currentPage - 1);
    }
}

function nextPage() {
    if (props.currentPage < props.totalPages) {
        emit('page-changed', props.currentPage + 1);
    }
}

function goToPage(page) {
    if (page !== props.currentPage) {
        emit('page-changed', page);
    }
}
</script>