import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/docs',
            name: 'docs',
            component: () => import('../views/Docs.vue'),
            children: [
                { path: '', redirect: '/docs/discovery' },
                { path: 'discovery', component: () => import('../views/specs/Discovery.vue') },
                { path: 'protocol', component: () => import('../views/specs/Protocol.vue') },
                { path: 'data-model', component: () => import('../views/specs/DataModel.vue') },
                { path: 'synchronization', component: () => import('../views/specs/Sync.vue') }
            ]
        },
        {
            path: '/roadmap',
            name: 'roadmap',
            component: () => import('../views/Roadmap.vue')
        }
    ],
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

export default router
