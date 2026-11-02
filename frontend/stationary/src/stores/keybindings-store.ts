import { defineStore } from "pinia"

interface Keybindings {
    [x: string]: number | null
}

export const useKeybindings = defineStore('keybindings', () => {
    let storedKeybindings = JSON.parse(window.localStorage.getItem('keybindings') || '{}')
    const keybindings = ref<Keybindings>(storedKeybindings)
    const updateKeybinding = function (key: string, itemId: number | null) {
        keybindings.value[key] = itemId
        saveKeybindings()
    }
    const removeKeybinding = function (key: string) {
        delete keybindings.value[key]
        saveKeybindings()
    }
    const saveKeybindings = function () {
        window.localStorage.setItem('keybindings', JSON.stringify(keybindings.value))
    }
    return {
        keybindings,
        updateKeybinding,
        removeKeybinding
    }
})