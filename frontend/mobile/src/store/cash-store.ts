import { defineStore } from "pinia"

export const useCashStore = defineStore('cash-store', () => {
    const selectedItems = ref<Array<{ itemId: number, amount: number }>>([])
    const _allSelected = ref(false)
    let _selectAll = () => {}
    let _deselectAll = () => {}

    const selection = computed(() => selectedItems)
    const allSelected = computed(() => _allSelected.value)

    const registerSelectAllCallback = function (cb: () => void) {
        _selectAll = cb
    }
    const registerDeselectAllCallback = function (cb: () => void) {
        _deselectAll = cb
    }
    const deregisterSelectAllCallback = function () {
        _selectAll = () => {}
    }
    const deregisterDeselectAllCallback = function () {
        _deselectAll = () => {}
    }

    const selectAll = function () {
        _selectAll()
        _allSelected.value = true
    }
    const deselectAll = function () {
        _deselectAll()
        _allSelected.value = false
    }
    const resetAllSelected = function () {
        _allSelected.value = false
    }

    return {
        selection,
        allSelected,
        registerSelectAllCallback,
        registerDeselectAllCallback,
        deregisterSelectAllCallback,
        deregisterDeselectAllCallback,
        selectAll,
        deselectAll,
        resetAllSelected
    }
})