import { defineStore } from "pinia";
import moment from 'moment'
import { Layout, LayoutItem } from "grid-layout-plus";

const { api } = useFeathers()

function isEqualLayout (a: Layout, b: Layout) {
    if (a === b) {
        return true
    }
    let sameLength = a.length === b.length
    if (!sameLength) {
        return false
    }
    let isEqualComponent = (e: LayoutItem, f: LayoutItem) => {
        return e.h === f.h && e.i === f.i && e.w === f.w && e.x === f.x && e.y === f.y
    }
    let allOfAIsInB = a.every((c) => b.find((d) => isEqualComponent(c, d)))
    if (!allOfAIsInB) {
        return false
    }
    let allOfBIsInA = b.every((c) => a.find((d) => isEqualComponent(c, d)))
    if (!allOfBIsInA) {
        return false
    }
    return true
}

export const useCalculatorStore = defineStore('calculator', () => {
    const savedQML = window.localStorage.getItem('qml')
    const savedQSL = window.localStorage.getItem('qsl')
    const savedNML = window.localStorage.getItem('nml')
    const savedNSL = window.localStorage.getItem('nsl')

    const parsedSavedQML = (savedQML ? JSON.parse(savedQML) : []) as Layout
    const parsedSavedQSL = (savedQSL ? JSON.parse(savedQSL) : []) as Array<{ categoryId: number, layout: Layout }>
    const parsedSavedNML = (savedNML ? JSON.parse(savedNML) : []) as Layout
    const parsedSavedNSL = (savedNSL ? JSON.parse(savedNSL) : []) as Array<{ categoryId: number, layout: Layout }>

    const quickMixedLayout = ref<Layout>(parsedSavedQML)
    const quickSeparatedLayout = ref<Array<{ categoryId: number, layout: Layout }>>(parsedSavedQSL)
    const normalMixedLayout = ref<Layout>(parsedSavedNML)
    const normalSeparatedLayout = ref<Array<{ categoryId: number, layout: Layout }>>(parsedSavedNSL)

    const separatedMode = ref(window.localStorage.getItem('separatedMode') !== 'false')
    const quickMode = ref(window.localStorage.getItem('quickMode') === 'true')
    const editMode = ref(false)
    const immediatelyFinishedMode = ref(true)
    const shoppingCartMethod = ref<() => void>(() => {})

    const mixedLayout = computed(() => {
        return quickMode.value ? quickMixedLayout.value : normalMixedLayout.value
    })
    const separatedLayout = computed(() => {
        return quickMode.value ? quickSeparatedLayout.value : normalSeparatedLayout.value
    })

    const updateSeparateMode = function (val: boolean) {
        separatedMode.value = val
        window.localStorage.setItem('separatedMode', val ? 'true' : 'false')
    }
    const updateQuickMode = function (val: boolean) {
        quickMode.value = val
        window.localStorage.setItem('quickMode', val ? 'true' : 'false')
    }
    const updateEditMode = function (val: boolean) {
        editMode.value = val
    }
    const updateImmediatelyFinishedMode = function (val: boolean) {
        immediatelyFinishedMode.value = val
    }
    const updateQML = function (newLayout: Layout) {
        if (!isEqualLayout(quickMixedLayout.value, newLayout)) {
            quickMixedLayout.value = newLayout
        }
        window.localStorage.setItem('qml', JSON.stringify(newLayout))
    }
    const updateNML = function (newLayout: Layout) {
        if (!isEqualLayout(normalMixedLayout.value, newLayout)) {
            normalMixedLayout.value = newLayout
        }
        window.localStorage.setItem('nml', JSON.stringify(newLayout))
    }
    const updateQSL = function (newLayout: Layout, categoryId: number) {
        let oldLayout = quickSeparatedLayout.value.find(({ categoryId: catId }) => catId === categoryId)?.layout || [] as Layout
        if (!isEqualLayout(oldLayout, newLayout)) {
            quickSeparatedLayout.value = [...quickSeparatedLayout.value.filter(({ categoryId: _catId }) => categoryId !== _catId), { categoryId, layout: newLayout }]
        }
        window.localStorage.setItem('qsl', JSON.stringify(quickSeparatedLayout.value))
    }
    const updateNSL = function (newLayout: Layout, categoryId: number) {
        let oldLayout = normalSeparatedLayout.value.find(({ categoryId: catId }) => catId === categoryId)?.layout || [] as Layout
        if (!isEqualLayout(oldLayout, newLayout)) {
            normalSeparatedLayout.value = [...normalSeparatedLayout.value.filter(({ categoryId: _catId }) => categoryId !== _catId), { categoryId, layout: newLayout }]
        }
        window.localStorage.setItem('nsl', JSON.stringify(normalSeparatedLayout.value))
    }

    const registerShoppingCart = function (cb: () => void) {
        shoppingCartMethod.value = cb
    }
    const removeShoppingCart = function () {
        shoppingCartMethod.value = () => {}
    }
    const openShoppingCart = function () {
        shoppingCartMethod.value()
    }

    return {
        quickMixedLayout,
        quickSeparatedLayout,
        normalMixedLayout,
        normalSeparatedLayout,
        separatedMode,
        quickMode,
        editMode,
        immediatelyFinishedMode,
        mixedLayout,
        separatedLayout,
        updateSeparateMode,
        updateQuickMode,
        updateEditMode,
        updateImmediatelyFinishedMode,
        updateQML,
        updateNML,
        updateQSL,
        updateNSL,
        registerShoppingCart,
        removeShoppingCart,
        openShoppingCart,
    }
})