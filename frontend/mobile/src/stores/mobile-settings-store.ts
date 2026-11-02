import { defineStore } from "pinia"

// usersettings only for mobile devices
// devicesettings for stationary devices
export const useMobileSettings = defineStore('mobile-settings', () => {
    let storedTableId = globalThis.localStorage.getItem('tableId')
    const tableId =     ref(storedTableId ? Number.parseInt(storedTableId) : null)

    const getTableId =  computed(() => tableId.value)

    const setTableId = function (value: number) {
        tableId.value = value
        if (!value) {
            globalThis.localStorage.removeItem('tableId')
        } else {
            globalThis.localStorage.setItem('tableId', value.toString())
        }
    }

    return {
        tableId,
        getTableId,
        setTableId
    }
})