// Composables
import { useUsersettings } from '@/store/usersettings-store'
import { createRouter, createWebHistory } from 'vue-router'
import type { Component } from 'vue'

import ShoppingCart from '@/components/BottomComponents/ShoppingCart.vue'
import OrderExtension from '@/components/AppBarExtensions/OrderExtension.vue'

const routes = [
  {
    path: '/',
    name: 'Base',
    redirect: (_to: any) => {
      let usersettings = useUsersettings()
      if (usersettings.onboarded) {
        return { name: 'Home' }
      } else {
        return { name: 'Onboarding' }
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
    component: () => import('@/views/Order.vue'),
    meta: {
      bottomComponent: ShoppingCart,
      extension: OrderExtension
    },
    beforeEnter: (_to: any, _from: any) => {
      const usersettings = useUsersettings()
      if (!usersettings.getName) { // includes null and empty strings
        return { name: 'EnterName' }
      }
      return true
    }
  },
  {
    path: '/enter-name',
    name: 'EnterName',
    component: () => import('@/views/NameInput.vue'),
    meta: {
      bottomComponent: ShoppingCart
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

declare module 'vue-router' {
  interface RouteMeta {
    extension?: Component,
    titleReplacement?: Component,
    appBarComponent?: Component,
    bottomComponent?: Component
  }
}
