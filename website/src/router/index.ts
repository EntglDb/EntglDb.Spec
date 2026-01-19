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
            component: () => import('vue-router').then(m => m.RouterView), // Use simple passthrough
            children: [
                { path: '', redirect: '/docs/v0.7.0/getting-started' },
                {
                    path: ':version',
                    component: () => import('../views/Docs.vue'), // Layout applies here
                    children: [
                        { path: '', redirect: to => `/docs/${to.params.version}/getting-started` },
                        { path: 'getting-started', component: () => import('../views/specs/GettingStarted.vue') },
                        { path: 'architecture', component: () => import('../views/specs/Architecture.vue') },
                        { path: 'security', component: () => import('../views/specs/Security.vue') },
                        { path: 'conflict-resolution', component: () => import('../views/specs/ConflictResolution.vue') },
                        { path: 'android-robustness', component: () => import('../views/specs/AndroidRobustness.vue') },
                        { path: 'discovery', component: () => import('../views/specs/Discovery.vue') },
                        { path: 'protocol', component: () => import('../views/specs/Protocol.vue') },
                        { path: 'data-model', component: () => import('../views/specs/DataModel.vue') },
                        { path: 'querying', component: () => import('../views/specs/Querying.vue') },
                        { path: 'synchronization', component: () => import('../views/specs/Sync.vue') }
                    ]
                }
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
