<template>
    <button
            :type="type"
            :disabled="disabled"
            :class="[
                baseClasses,
                colorClasses,
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            ]">
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    color: {
        type: String,
        default: 'primary',
    },
    type: {
        type: String,
        default: 'button',
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})

const baseClasses = 'text-white px-4 py-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 cursor-pointer'

const colorMap = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400',
    secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-400',
    blue: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'
}

const colorClasses = computed(() => {
    return colorMap[props.color] ?? colorMap.primary
})
</script>
