import { fetchAllBaseItems, fetchAllCategories, fetchAllFlavours, fetchAllItems, fetchAllOrderedItems, fetchAllOrders, fetchAllSizes, fetchAllTables } from '@/utilities/fetchUtility'
import { NavigationResult } from 'unplugin-vue-router/data-loaders'
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'
export const useHistoryLoader = defineBasicLoader('/history', async (_to) => {
    const { api } = useFeathers()
    const { userId } = useAuthStore()
    if (!userId) {
        return new NavigationResult({ name: '/error' })
    }
    let { data: users } = api.service('users').findInStore({ query: { id: userId as number } })
    if (users?.length !== 1) {
        return new NavigationResult({ name: '/error' })
    }
    const { data: tenants } = api.service('tenants').findInStore({ query: { id: users[0]?.tenantId } })
    if (tenants?.length !== 1) {
        return new NavigationResult({ name: '/error' })
    }
    let tenant = tenants[0]
    if (!tenant) {
        return new NavigationResult({ name: '/error' })
    }
    await fetchAllOrders({})
    await fetchAllOrderedItems({})
    await fetchAllTables({})
    await fetchAllBaseItems({})
    await fetchAllSizes({})
    await fetchAllCategories({})
    // await fetchAllOptions({})
    await fetchAllFlavours({})
    await fetchAllItems({})
    return {}
})