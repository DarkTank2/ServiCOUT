// Composables
import { useUsersettings } from '@/store/usersettings-store'
import { createRouter, createWebHistory } from 'vue-router'
import type { Component } from 'vue'

import Timer from '@/components/AppBar/Time.vue'

const routes = [
  {
    path: '/',
    name: 'base',
    redirect: () => {
      return { name: 'Main' }
    }
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('@/views/Main.vue'),
    meta: {
      appBarComponent: Timer
    }
  },
  {
    path: '/item-manager',
    name: 'ItemManager',
    component: () => import('@/views/ItemManager.vue')
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: () => import('@/views/Subscriptions.vue')
  },
  {
    path: '/configuration',
    name: 'GlobalConfig',
    component: () => import('@/views/GlobalConfig.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: to.meta.extension ? 132 : 84
      }
    } else {
      return { top: 0 }
    }
  }
})
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  const { api } = useFeathers()
  const accessToken = await api.authentication.getAccessToken()
  if (accessToken) {
    const isExpired = authStore.isTokenExpired(accessToken)
    if (!isExpired) {
      console.log('Accesstoken valid.')
      return true
    }
    console.log('Accesstoken expired...')
  }

  // always resolves. no need to catch
  await authStore.authenticate({ strategy: 'local', email: 'email', password: 'password' })

  return true
})

export default router

declare module 'vue-router' {
  interface RouteMeta {
    extension?: Component,
    titleReplacement?: Component,
    appBarComponent?: Component,
    bottomComponent?: Component,
    transition?: string
  }
}
