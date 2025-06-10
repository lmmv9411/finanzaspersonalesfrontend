<template>
    <select
            :id="id"
            :value="modelValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :class="[
                baseClasses,
                colorClasses,
                disabled ? 'opacity-50 cursor-not-allowed' : '']"
            @input="$emit('update:modelValue', $event.target.value)">
        <slot />
    </select>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: { required: true },
    placeholder: String,
    id: String,
    color: {
        type: String,
        default: 'primary' // 'primary', 'danger', etc.
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

const baseClasses = 'w-full dark:text-gray-200 text-gray-600 px-3 py-2 border rounded-sm focus:outline-none transition duration-300 focus:ring-2'

const colorMap = {
    primary: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
    danger: 'border-red-300 focus:border-red-500 focus:ring-red-500'
}

const colorClasses = computed(() => {
    return colorMap[props.color] ?? colorMap.primary
})
</script>
