import { defineStore } from "pinia";
import moment from 'moment'

const { api } = useFeathers()

// usersettings only for mobile devices
// devicesettings for stationary devices
export const useUsersettings = defineStore('usersettings', () => {
    const name =                ref(window.localStorage.getItem('userName'))
    const onboardedAt =         ref(window.localStorage.getItem('onboardedAt'))
    const storedSubscriptions = window.localStorage.getItem('subscriptions')
    const subscriptions =       ref<Array<number>>(storedSubscriptions ? JSON.parse(storedSubscriptions) : [])

    const getName =             computed(() => name.value)
    const getSubscriptions =    computed(() => subscriptions.value)
    // const getOnboardingDate = computed(() => onboardedAt.value)
    const onboarded =   computed(() => {
        if (!onboardedAt.value) return false
        if (moment(onboardedAt.value).isBefore(moment(import.meta.env.VITE_ONBOARDING_VALID_AFTER))) return false
        return true
    })

    const setName = function (value: string) {
        name.value = value
        if (!value) {
            window.localStorage.removeItem('userName')
        } else {
            window.localStorage.setItem('userName', value)
        }
    }
    const finalizeOnboarding = function () {
        let now = moment().format()
        onboardedAt.value = now
        window.localStorage.setItem('onboardedAt', now)
    }
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

    return {
        name,
        onboarded,
        getName,
        setName,
        finalizeOnboarding,
        subscriptions,
        getSubscriptions,
        updateSubscriptions,
        toggleSubscribedCategory
    }
})