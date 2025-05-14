import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import { API_BASE_URL } from '../constants'
import DefaultLayout from '../components/DefaultLayout.vue'
import AuthLayout from '../components/AuthLayout.vue'

const routes = [
    {
        path: '/',
        component: DefaultLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('../views/Home.vue'),

            },
            {
                path: '/configs',
                name: 'Configs',
                component: () => import('../views/Configs.vue')
            },
            {
                path: '/movements',
                name: 'Movements',
                component: () => import('../views/Movements.vue')
            },
            {
                path: '/categories',
                name: 'Categories',
                component: () => import('../views/Categories.vue')
            }
        ]
    },
    {
        path: '/login',
        component: AuthLayout,
        children: [
            {
                path: '',
                name: 'Login',
                component: () => import('../views/Login.vue')
            }
        ]
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})


router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            // intenta validar la sesión en el backend
            await axios.get(`${API_BASE_URL}/auth/check`, { withCredentials: true })
            next() // sesión válida
        } catch (err) {
            next({ name: 'Login' }) // redirige al login
        }
    } else {
        next()
    }
})

export default router
