import { defineStore } from "pinia"

type Notification = {
    message: string,
    icon?: string,
    colorClass?: string,
    type: 'success' | 'error',
    timeout: number
}

export const useUtilityStore = defineStore('utilities', () => {
    const { api } = useFeathers()
    const usersettings = useUsersettings()
    const auth = useAuthStore()

    const fetchPending = ref(false)
    const notification = ref<Notification>({ message: '', type: 'success', timeout: 0 })

    const isFetchPending = computed(() => fetchPending.value)
    const getNotification = computed(() => notification.value)

    function setFetchPending () {
        fetchPending.value = true
    }
    function resetFetchPending () {
        fetchPending.value = false
    }

    function setNotification (value: Notification) {
        notification.value = value
    }
    function resetNotification () {
        notification.value = { message: '', type: 'success', timeout: 0 }
    }

    const countTempOrderedItems = api.service('ordered-items').countInStore(computed(() => ({ query: { __isTemp: true }, temps: true }))) as any as ComputedRef<number>
    const { data: allTempOrderedItems } = toRefs(api.service('ordered-items').findInStore(computed(() => ({ query: { __isTemp: true, $limit: countTempOrderedItems.value }, temps: true }))))
    
    async function sendOrder (mode: 'waiter'): Promise<void>
    async function sendOrder (mode: 'station', cashed: boolean) : Promise<void>
    async function sendOrder (mode: 'waiter' | 'station', cashed?: boolean) : Promise<void> {
        if (allTempOrderedItems.value.length === 0) {
            return
        }
        if (mode === 'waiter') {
            throw new Error('Method "sendOrder" is not yet implemented for mode "waiter"!')
        }
        setFetchPending()
        // for now create the order on table 1, maybe add mechanism for tables not showing for waiters but ordering for stationary devices there
        let order = await api.service('orders').create({ waiter: usersettings.name!, tableId: 1, tenantId: auth.user.tenantId as number })
        for (let tempOrderedItem of allTempOrderedItems.value) {
            tempOrderedItem.orderId = order.id
            if (cashed === false) {
                tempOrderedItem.open = tempOrderedItem.quantity
                tempOrderedItem.notCashed = tempOrderedItem.quantity
            } else {
                tempOrderedItem.open = 0
                tempOrderedItem.notCashed = 0
            }
            await tempOrderedItem.save()
        }
        resetFetchPending()
        setNotification({ message: 'Bestellung erfolgreich abgesendet!', type: 'success', timeout: -1 })
    }

    return {
        fetchPending,
        notification,
        isFetchPending,
        getNotification,
        setFetchPending,
        resetFetchPending,
        setNotification,
        resetNotification,
        sendOrder
    }
})