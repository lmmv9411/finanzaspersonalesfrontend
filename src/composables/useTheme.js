// src/composables/useTheme.js
import { ref, onMounted, watch } from 'vue'


export function useTheme() {

    const theme = ref('light') // 'light', 'dark', o 'system'

    const setThemeClass = (value) => {
        const root = document.documentElement
        if (value === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }

    const applyTheme = () => {
        if (theme.value === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setThemeClass(isDark ? 'dark' : 'light')
        } else {
            setThemeClass(theme.value)
        }
    }

    onMounted(() => {
        // Leer de localStorage si existe
        const saved = localStorage.getItem('theme')
        if (saved) theme.value = saved

        // Escuchar cambios en sistema si es automático
        if (theme.value === 'system') {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme)
        }

        applyTheme()
    })

    watch(theme, (newTheme) => {
        localStorage.setItem('theme', newTheme)
        applyTheme()
    })

    return { theme }
}
