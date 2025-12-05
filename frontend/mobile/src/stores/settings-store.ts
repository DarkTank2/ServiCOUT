import { defineStore } from "pinia";
import moment from 'moment'

// usersettings only for mobile devices
// devicesettings for stationary devices
export const useSettings = defineStore('settings', () => {
    const name =        ref(globalThis.localStorage.getItem('userName'))
    const onboardedAt = ref(globalThis.localStorage.getItem('onboardedAt'))
    
    const getName =             computed(() => name.value)
    // const getOnboardingDate = computed(() => onboardedAt.value)
    
    const onboarded =   computed(() => {
        if (!onboardedAt.value) return false
        if (moment(onboardedAt.value).isBefore(moment(import.meta.env.VITE_ONBOARDING_VALID_AFTER))) return false
        return true
    })

    const setName = function (value: string) {
        name.value = value
        if (!value) {
            globalThis.localStorage.removeItem('userName')
        } else {
            globalThis.localStorage.setItem('userName', value)
        }
    }
    const finalizeOnboarding = function () {
        let now = moment().format()
        onboardedAt.value = now
        globalThis.localStorage.setItem('onboardedAt', now)
    }

    return {
        name,
        onboarded,
        getName,
        setName,
        finalizeOnboarding
    }
})