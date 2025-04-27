import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/configs', name: 'Configs', component: () => import('../views/Configs.vue') },
    { path: '/movements', name: 'Movements', component: () => import('../views/Movements.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
