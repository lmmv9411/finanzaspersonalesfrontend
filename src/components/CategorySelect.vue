<template>
    <div class="w-full">

        <button @click="toggleDropDown"
                type="button"
                class="w-full flex items-center justify-between p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 text-left">

            <div v-if="selectedCategory" class="flex items-center gap-2">
                <div :class=[getRandomBgColor(selectedCategory.icon)]
                     class="rounded-full p-1 text-white text-lg">
                    <Icon :icon="selectedCategory.icon" class="w-5 h-5" />
                </div>

                <span>{{ selectedCategory.name }}</span>

            </div>

            <span v-else>Selecciona Categoria</span>

            <ChevronDownIcon class="w-5 h-5 text-gray-400" />
        </button>

        <Transition name="slide-down">
            <div v-show="isOpen"
                 class="max-h-60 p-2 overflow-y-auto mt-1 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 max-h-60">
                <div class="grid grid-cols-4  gap-3">
                    <div
                         v-for="category in categories"
                         :key="category.id"
                         @click="selectCategory(category)"
                         class="flex p-1 flex-col items-center rounded-lg cursor-pointer transition-all"
                         :class="{
                            'bg-primary-100 dark:bg-primary-900 border-2 border-gray-200 dark:border-gray-500': modelValue === category.id,
                            'hover:bg-gray-200 dark:hover:bg-gray-700': modelValue !== category.id
                        }">
                        <div :class=[getRandomBgColor(category.icon)]
                             class="rounded-full p-2 text-white text-lg hover:scale-110 duration-200">
                            <Icon :icon="category.icon" />
                        </div>
                        <span class="mt-1 text-xs block w-full text-center break-words text-wrap">{{ category.name }}</span>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/solid';
import { Icon } from '@iconify/vue';
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useCategorieStore } from '../stores/categoriesStore';
import { getRandomBgColor } from '../views/configs/icons.js';

const props = defineProps({ modelValue: Number, type: String })
const emit = defineEmits(['update:modelValue'])

const categoriesStore = useCategorieStore();
const categories = ref([])

const isOpen = ref(false)

const toggleDropDown = () => isOpen.value = !isOpen.value

const selectedCategory = ref(null)

const selectCategory = (category) => {
    emit('update:modelValue', category.id);
    selectedCategory.value = category
    isOpen.value = false
}

watchEffect(() => {
    if (props.modelValue === 0) {
        selectedCategory.value = ''
    }
})

watch(() => props.type, () => {
    categories.value = categoriesStore.categories.filter(c => c.type === props.type)
    selectedCategory.value = ''
})

onMounted(async () => {
    await categoriesStore.getCategories();

    const c = categoriesStore.categories.find((c) => c.id === props.modelValue)

    if (c) {
        selectedCategory.value = c
    }

    if (!props.type) {
        categories.value = categoriesStore.categories
    } else {
        categories.value = categoriesStore.categories.filter(c => c.type === props.type)
    }
})

</script>

<style scoped>
.slide-down-enter-active {
    transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-down-leave-active {
    transition: all 400ms cubic-bezier(0.7, 0, 0.84, 0);
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>