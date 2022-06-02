import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Module from '../views/Module.vue'
import SupermarketChapter from '../views/SupermarketChapter.vue'
import SocksChapter from '../views/SocksChapter.vue'
import AlgorithmOverview from '../views/AlgorithmOverview.vue'
import ChapterSelection from '../views/ChapterSelection.vue'


const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/:moduleName',
        name: 'parking',
        component: Module,
        props: true
    },
    {
        path: '/:moduleName',
        name: 'supermarket',
        component: Module,
        props: true
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
        path: '/:moduleName/chapters/',
        name: 'chapters',
        component: ChapterSelection,
        props: true

    },
    {
        path: '/:moduleName/algorithms/',
        name: 'algorithms',
        component: AlgorithmOverview,
        props: true

    },
    {
        path: '/:moduleName/:laboratory/',
        name: 'laboratory',
        component: AlgorithmOverview,
        props: true

    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router