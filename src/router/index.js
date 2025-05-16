import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../components/AuthLayout.vue'
import DefaultLayout from '../components/DefaultLayout.vue'
import api from '../constants/api'

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
    /*if (to.meta.requiresAuth) {
        try {
            await api.get('/auth/check', { withCredentials: true })
            next()
        } catch (err) {
            next({ name: 'Login' })
        }
    } else {
        next()
    }*/
    next()
})

export default router
