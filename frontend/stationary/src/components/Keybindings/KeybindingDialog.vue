<template>
    <v-dialog v-model="dialog" width="800px">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-plus" variant="outlined" />
        </template>
        <v-card title="Taste hinzufügen">
            <v-card-text>
                <v-row>
                    <v-col cols="6">
                        <v-text-field variant="outlined" density="compact" v-model="key" disabled label="Beliebige Taste drücken" hint="Mit 'ENTF' kannst du die Tastenauswahl zurücksetzen!" persistent-hint></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-select variant="outlined" density="compact" :items="modifiedItems" item-value="id" item-title="name"
                            v-model="itemId" label="Wähle ein Produkt aus"></v-select>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-btn @click="close" variant="outlined">
                    Abbrechen
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="save" variant="outlined">
                    Speichern
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
const { api } = useFeathers()
const { updateKeybinding } = useKeybindings()

const dialog = ref<boolean>(false)
const key = ref<string | null>(null)
const itemId = ref<number | null>(null)

const countedItems = api.service('items').countInStore(computed(() => ({ query: {} })))
const { data: allItems } = toRefs(api.service('items').findInStore(computed(() => ({ query: {}, $limit: countedItems.total }))))
const modifiedItems = computed(() => {
    return allItems.value.map(item => {
        let size = api.service('sizes').getFromStore(item.sizeId!)
        let flavour = api.service('flavours').getFromStore(item.flavourId!)
        let baseItem = api.service('base-items').getFromStore(item.baseItemId!)
        return {
            id: item.id,
            name: `${size.value.name} ${baseItem.value.name} ${flavour.value.name}`
        }
    })
})

const keyupCallback = function (event: KeyboardEvent) {
    let { key: pressedKey } = event
    if (pressedKey === 'Enter') {
        save()
        return
    }
    if (pressedKey === 'Delete') {
        key.value = null
        return
    }
    key.value = pressedKey
}
const save = function () {
    if (key.value === null ||itemId.value === null) {
        return
    }
    updateKeybinding(key.value, itemId.value)
    close()
}
const close = function () {
    key.value = null
    itemId.value = null
    dialog.value = false
}

watch(dialog, (newVal) => {
    if (newVal) {
        window.addEventListener('keyup', keyupCallback)
    } else {
        window.removeEventListener('keyup', keyupCallback)
        close()
    }
})
</script>