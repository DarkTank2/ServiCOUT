import { defineStore } from "pinia"

export const useCashStore = defineStore('cash-store', () => {
    const selectedItems = ref<Array<{ itemId: number, amount: number }>>([])
})