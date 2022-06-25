import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Module from '../views/Module.vue'
import SupermarketChapter from '../views/SupermarketChapter.vue'
import SocksChapter from '../views/SocksChapter.vue'
import AlgorithmOverview from '../views/AlgorithmOverview.vue'
import Selection from '../views/Selection.vue'


const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/socks',
        name: 'socks',
        component: Module,
        props: { moduleName: 'socks' }
    },
    {
        path: '/supermarket',
        name: 'supermarket',
        component: Module,
        props: { moduleName: 'supermarket' }
    },
    {
        path: '/supermarket/chapters/:chapterId',
        name: 'supermarket_chapter_1',
        component: SupermarketChapter,
        props: true

    },
    {
        path: '/socks/chapters/:chapterId',
        name: 'socks_chapter_1',
        component: SocksChapter,
        props: true

    },
    {
        path: '/supermarket/chapters/',
        name: 'supermarket_chapters',
        component: Selection,
        props: { moduleName: 'supermarket', type: 'chapters' }

    },
    {
        path: '/supermarket/challenges/',
        name: 'supermarket_challenges',
        component: Selection,
        props: { moduleName: 'supermarket', type: 'challenges' }

    },

    {
        path: '/socks/chapters/',
        name: 'socks_chapters',
        component: Selection,
        props: { moduleName: 'socks', type: 'chapters' }

    },
    {
        path: '/socks/challenges/',
        name: 'socks_challenges',
        component: Selection,
        props: { moduleName: 'socks', type: 'challenges' }

    },
    {
        path: '/supermarket/lva/',
        name: 'supermarket_lva',
        component: AlgorithmOverview,
        props: { moduleName: 'supermarket', lva: true }

    },
    {
        path: '/socks/lva/',
        name: 'socks_lva',
        component: AlgorithmOverview,
        props: { moduleName: 'socks', lva: true }

    },
    {
        path: '/:moduleName/challenges/:challengeId',
        name: 'challenge',
        component: AlgorithmOverview,
        props: true

    },
    {
        path: '/supermarket/laboratory/',
        name: 'supermarket_laboratory',
        component: AlgorithmOverview,
        props: { laboratory: 'laboratory', moduleName: 'supermarket' }

    },
    {
        path: '/socks/laboratory/',
        name: 'socks_laboratory',
        component: AlgorithmOverview,
        props: { laboratory: 'laboratory', moduleName: 'socks' }

    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router