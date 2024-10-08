import { createRouter, createWebHistory } from 'vue-router'
import ProductManagerDashboard from './components/ProductManagerDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ProductManagerDashboard
  },
  {
    path: '/user-analysis',
    name: 'UserAnalysis',
    component: () => import('./components/phases/UserAnalysisPhase.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router