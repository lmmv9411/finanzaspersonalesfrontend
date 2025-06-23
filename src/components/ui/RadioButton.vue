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
                        ? `bg-${option.color}-100 border-2 border-${option.color}-300 text-${option.color}-700 dark:bg-${option.color}-900/30 dark:border-${option.color}-700 dark:text-${option.color}-300`
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
</script>

<style scoped>
/* Smooth transition for colors */
* {
    transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}
</style>