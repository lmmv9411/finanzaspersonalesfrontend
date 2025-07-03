import { createRouter, createWebHistory } from 'vue-router'
import { useNotifications } from '../composables/useNotifications'
import { checkAuth } from '../api/auth';

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
                path: '/movement',
                name: 'Movement',
                component: () => import('../views/Movement.vue')
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

    const { showError } = useNotifications()

    const handleAuthError = (error) => {
        console.error(error);
        const status = error.response?.status;

        if (status !== 401) {
            showError(error.message);
        }

        if (status === 401) {
            localStorage.removeItem('jwt_token');
            next({ name: 'Login' });
        } else {
            next();
        }
    };

    if (to.name === 'Login' && localStorage.getItem('jwt_token')) {
        try {
            await checkAuth()
            next({ name: 'Home' })
        } catch (error) {
            handleAuthError(error);
        }
        return;
    }

    if (to.meta.requiresAuth) {
        try {
            await checkAuth()
            next()
        } catch (error) {
            handleAuthError(error);
        }
    } else {
        next()
    }

})


export default router

