/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHashHistory, type _Awaitable, type NavigationGuardReturn } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})
const handleAuthentication: () => _Awaitable<NavigationGuardReturn> = async function () {
  const authStore = useAuthStore()
  const { api } = useFeathers()
  const accessToken = await api.authentication.getAccessToken()
  if (accessToken) {
    const isExpired = authStore.isTokenExpired(accessToken)
    if (!isExpired) {
      console.log('Accesstoken valid.')
      await authStore.reAuthenticate()
      return true
    }
    console.log('Accesstoken expired...')
  }

  // always resolves. no need to catch
  let authenticationResult = await authStore.authenticate({ strategy: 'local', email: 'email', password: 'password' }).then(() => true).catch(() => false)
  if (!authenticationResult) {
    return { path: '/error' }
  }
  await authStore.getPromise()
  return true
}
const ensureDataPresence: () => _Awaitable<NavigationGuardReturn> = async function () {
  const { api } = useFeathers()
  const authStore = useAuthStore()
  let userId = authStore.userId!
  let user = api.service('users').getFromStore(userId)
  await api.service('tenants').get(user.value.tenantId!)
}

router.beforeEach(async (to, from) => {
  if (to.meta.requiresAuth === false) {
    return true
  }
  // the result is either true if the user is authenticated
  // or the error-page if something went wrong whilst authenticating
  let res = await handleAuthentication()
  if (res !== true) {
    return res
  }
  // at this point the user is authenticated, or at least re-authenticated
  // thus the user is accessible from the auth-store and has a token available
  await ensureDataPresence()
  if (to.meta.requiresAuth === 'user') {
    return true
  }
  // admin is required
  const auth = useAuthStore()
  const { api } = useFeathers()
  let user = api.service('users').getFromStore(auth.userId!)
  if (user?.value?.role?.name === 'admin' && user?.value?.role?.id === 1) {
    return true
  }
  return '/error'
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    isAdmin?: boolean
    // must be declared by every route
    requiresAuth: 'admin' | 'user' | false
  }
}
export default router
