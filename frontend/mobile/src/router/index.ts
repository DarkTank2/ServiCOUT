// Composables
import { useUsersettings } from '@/store/usersettings-store'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Base',
    redirect: (_to: any) => {
      let usersettings = useUsersettings()
      if (usersettings.onboarded) {
        return 'Home'
      } else {
        return 'Onboarding'
      }
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('@/views/Onboarding.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/Order.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

declare module 'vue-router' {
  interface RouteMeta {
    extension?: string
  }
}
