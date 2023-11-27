import { defineStore } from "pinia"

interface Notification {
    message: string,
    icon?: string,
    colorClass?: string,
    type: ['success', 'error'],
    timeout: number
}

export const useUtilityStore = defineStore('utilities', () => {
    const fetchPending = ref(false)
    const notification = ref<Notification | null>(null)

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
        notification.value = null
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