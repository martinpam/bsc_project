import { createRouter, createWebHistory } from 'vue-router'
import  Home  from '../views/Home.vue'
import  Parking  from '../views/Parking.vue'
import  Module  from '../views/Module.vue'
import  SupermarketChapter  from '../views/SupermarketChapter.vue'
import  AlgorithmOverview  from '../views/AlgorithmOverview.vue'

const routes = [
  {
    path: '/home',
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
