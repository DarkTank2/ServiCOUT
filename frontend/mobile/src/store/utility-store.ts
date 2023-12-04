import { defineStore } from "pinia"

type Notification = {
    message: string,
    icon?: string,
    colorClass?: string,
    type: 'success' | 'error',
    timeout: number
}

export const useUtilityStore = defineStore('utilities', () => {
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

    return {
        fetchPending,
        notification,
        isFetchPending,
        getNotification,
        setFetchPending,
        resetFetchPending,
        setNotification,
        resetNotification
    }
})