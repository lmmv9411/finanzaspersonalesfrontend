<template>
    <div class="flex gap-2">
        <label
               v-for="option in options"
               :key="option.value"
               class="relative">
            <input
                   type="radio"
                   :value="option.value"
                   v-model="selectedValue"
                   class="absolute opacity-0 w-0 h-0"
                   @change="handleChange" />
            <span
                  class="inline-flex items-center px-4 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-all duration-200"
                  :class="[
                    selectedValue === option.value
                        ? colorClasses[option.color]?.base
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                ]">
                <component
                           v-if="option.icon"
                           :is="option.icon"
                           class="w-4 h-4 mr-2" />
                {{ option.label }}
            </span>
        </label>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        required: true,
        validator: (options) => {
            return options.every(option =>
                typeof option === 'object' &&
                'value' in option &&
                'label' in option &&
                'color' in option
            );
        }
    }
});

const emit = defineEmits(['update:modelValue']);

const selectedValue = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
    selectedValue.value = newVal;
});

const handleChange = () => {
    emit('update:modelValue', selectedValue.value);
};

const colorClasses = {
    red: {
        base: 'bg-red-100 border-2 border-red-300 text-red-700 dark:bg-red-900/10 dark:border-red-400 dark:text-red-100',
    },
    green: {
        base: 'bg-green-100 border-2 border-green-300 text-green-700 dark:bg-green-900/10 dark:border-green-400 dark:text-green-100',
    },
    blue: {
        base: 'bg-blue-100 border-2 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300',
    },
    // Agrega más colores que uses
};

</script>

<style scoped>
/* Smooth transition for colors */
* {
    transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}
</style>