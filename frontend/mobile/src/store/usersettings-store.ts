import { defineStore } from "pinia";
import moment from 'moment'

// usersettings only for mobile devices
// devicesettings for stationary devices
export const useUsersettings = defineStore('usersettings', () => {
    const name =        ref(window.localStorage.getItem('userName'))
    let storedTableId = window.localStorage.getItem('tableId')
    const tableId =     ref(storedTableId ? parseInt(storedTableId) : null)
    const onboardedAt = ref(window.localStorage.getItem('onboardedAt'))

    const getName =     computed(() => name.value)
    const getTableId =  computed(() => tableId.value)
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
    const setTableId = function (value: number) {
        tableId.value = value
        if (!value) {
            window.localStorage.removeItem('tableId')
        } else {
            window.localStorage.setItem('tableId', value.toString())
        }
    }
    const finalizeOnboarding = function () {
        let now = moment().format()
        onboardedAt.value = now
        window.localStorage.setItem('onboardedAt', now)
    }

    return {
        name,
        tableId,
        onboarded,
        getName,
        getTableId,
        setName,
        setTableId,
        finalizeOnboarding
    }
})