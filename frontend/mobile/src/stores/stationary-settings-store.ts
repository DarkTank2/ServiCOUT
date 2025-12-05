import { defineStore } from "pinia"

// usersettings only for mobile devices
// devicesettings for stationary devices
export const useStationarySettings = defineStore('stationary-settings', () => {
    const key = useApiInjectionKey()
const apiType = inject(key)
const api = useFeathers()[apiType!]
    const storedSubscriptions = window.localStorage.getItem('subscriptions')
    const subscriptions =       ref<Array<number>>(storedSubscriptions ? JSON.parse(storedSubscriptions) : [])

    const itemDisplayFormat =   ref(window.localStorage.getItem('itemDisplayFormat'))
    const shortenDisplayName =  ref(true)

    const getSubscriptions =    computed(() => subscriptions.value)
    
    const saveSubscription = function () {
        window.localStorage.setItem('subscriptions', JSON.stringify(subscriptions.value))
    }
    const updateSubscriptions = function (id: number) {
        if (subscriptions.value.includes(id)) {
            subscriptions.value = subscriptions.value.filter(val => val !== id).sort()
        } else {
            subscriptions.value = [id, ...subscriptions.value].sort()
        }
        saveSubscription()
    }
    const toggleSubscribedCategory = function (id: number) {
        const baseItems = api.service('base-items').findInStore({ query: { categoryId: id } }).data
        if (baseItems.every(({ id }) => subscriptions.value.includes(id!))) {
            console.log('Removing all items for category')
            // all base items of the category are included, thus remove them all from the subscriptions
            subscriptions.value = subscriptions.value.filter(val => !baseItems.map(({ id }) => id).includes(id))
        } else {
            console.log('adding all items for category')
            // not all items are included, thus add all items from the category
            subscriptions.value = [...new Set([...subscriptions.value, ...baseItems.map(({ id }) => id!)])]
        }
        saveSubscription()
    }
    const updateItemDisplayFormat = function (format: string) {
        itemDisplayFormat.value = format
        window.localStorage.setItem('itemDisplayFormat', format)
    }
    const updateShortenDisplayName = function (val: boolean) {
        shortenDisplayName.value = val
    }

    return {
        subscriptions,
        getSubscriptions,
        itemDisplayFormat,
        shortenDisplayName,
        updateSubscriptions,
        toggleSubscribedCategory,
        updateItemDisplayFormat,
        updateShortenDisplayName
    }
})