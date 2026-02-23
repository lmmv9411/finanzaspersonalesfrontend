<template>
    <div class="w-full">
        <button
            @click="toggleDropDown"
            type="button"
            class="w-full flex items-center justify-between p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 text-left"
        >
            <div v-if="selectedAccount" class="flex items-center gap-2">
                <div class="rounded-full p-1 text-white text-lg bg-indigo-500">
                    <Icon :icon="selectedAccount.type || 'mdi:credit-card-outline'" class="w-5 h-5" />
                </div>
                <span>{{ selectedAccount.name }}</span>
            </div>

            <span v-else>Selecciona Cuenta</span>

            <ChevronDownIcon class="w-5 h-5 text-gray-400" />
        </button>

        <Transition name="slide-down">
            <div
                v-show="isOpen"
                class="p-2 overflow-y-auto mt-1 rounded-md bg-gray-100 dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 max-h-60"
            >
                <div class="space-y-2">
                    <button
                        v-for="account in accounts"
                        :key="account.id"
                        type="button"
                        @click="selectAccount(account)"
                        class="w-full flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all"
                        :class="{
                            'bg-primary-100 dark:bg-primary-900 border border-gray-200 dark:border-gray-500': modelValue === account.id,
                            'hover:bg-gray-200 dark:hover:bg-gray-700': modelValue !== account.id
                        }"
                    >
                        <div class="flex items-center gap-2">
                            <div class="rounded-full p-1 text-white text-lg bg-indigo-500">
                                <Icon :icon="account.type || 'mdi:credit-card-outline'" class="w-5 h-5" />
                            </div>
                            <span>{{ account.name }}</span>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-300">{{ formatoMoneda(Number(account.balance || 0)) }}</span>
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/solid';
import { Icon } from '@iconify/vue';
import { onMounted, ref, watch } from 'vue';
import { getAccounts } from '../api/accounts';
import { formatoMoneda } from '../constants';

const props = defineProps({ modelValue: Number });
const emit = defineEmits(['update:modelValue']);

const accounts = ref([]);
const selectedAccount = ref(null);
const isOpen = ref(false);

const toggleDropDown = () => {
    isOpen.value = !isOpen.value;
};

const selectAccount = (account) => {
    emit('update:modelValue', account.id);
    selectedAccount.value = account;
    isOpen.value = false;
};

const fetchAccounts = async () => {
    const { data } = await getAccounts();
    const list = Array.isArray(data) ? data : (data.accounts ?? []);
    accounts.value = list;

    if (props.modelValue) {
        const current = accounts.value.find((account) => account.id === props.modelValue);
        selectedAccount.value = current || null;
    }
};

watch(() => props.modelValue, (newValue) => {
    if (!newValue) {
        selectedAccount.value = null;
        return;
    }

    const current = accounts.value.find((account) => account.id === newValue);
    selectedAccount.value = current || null;
});

onMounted(fetchAccounts);
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
