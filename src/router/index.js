import { createRouter, createWebHistory } from 'vue-router'
import api from '../constants/api'

const routes = [
    {
        path: '/',
        component: () => import('../components/DefaultLayout.vue'),
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
                component: () => import('../views/Configs.vue'),
                children: [
                    {
                        path: '',
                        name: 'ProfilePicture',
                        component: () => import('../views/configs/ProfilePicture.vue')
                    },
                    {
                        path: 'password',
                        name: 'Password',
                        component: () => import('../views/configs/Password.vue')
                    }
                ]
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
        component: () => import('../components/AuthLayout.vue'),
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

    if (to.name === 'Login' && localStorage.getItem('jwt_token')) {
        try {
            await api.get('/auth/check', { withCredentials: true })
            next({ name: 'Home' })
        } catch (error) {
            localStorage.removeItem('jwt_token')
            next({ name: 'Login' })
        }

        return;
    }

    if (to.meta.requiresAuth) {
        try {
            await api.get('/auth/check', { withCredentials: true })
            next()
        } catch (err) {
            localStorage.removeItem('jwt_token')
            next({ name: 'Login' })
        }
    } else {
        next()
    }

})


export default router
