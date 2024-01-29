<template>
    <v-container fluid style="padding-bottom: 68px;">
        <template v-for="({ baseItem, items }, index) in clusteredBaseItems">
            <v-divider v-if="index !== 0"></v-divider>
            <v-row>
                <v-col cols="8">
                    <v-list-item :title="baseItem.name"></v-list-item>
                </v-col>
            </v-row>
            <v-row justify="space-around" class="mb-2">
                <template v-for="{ size, flavour, cashable, item, selected } in items">
                    <v-col cols="9">
                        <v-list-item variant="outlined" rounded @click="incrementSelection(baseItem.id!, item.id!, cashable)"
                            :disabled="selected === cashable">
                            <v-list-item-subtitle style="opacity: 1 !important;">
                                {{ `${size?.name} | ${flavour?.name} | á ${item.price}€` }}
                            </v-list-item-subtitle>
                            <template #append>
                                {{ `${cashable - selected}` }}
                            </template>
                        </v-list-item>
                    </v-col>
                    <v-divider vertical></v-divider>
                    <v-col cols="2">
                        <v-btn block variant="outlined" height="100%" @click="decrementSelection(baseItem.id!, item.id!)"
                            :disabled="selected === 0">{{ selected }}</v-btn>
                    </v-col>
                </template>
            </v-row>
        </template>
        <template v-if="clusteredBaseItems.length === 0">
          <v-alert type="info">Gibt nix zum sehen, zurück zu den Tischen mit dir! (Oder drücke <v-btn :to="{ name: 'Cash/AllTables' }" variant="outlined">hier</v-btn>)</v-alert>
        </template>
        <v-btn elevation="2" position="fixed"
            style="bottom: 66px !important; right: 10px !important; background: rgb(var(--v-theme-surface));" icon="mdi-currency-eur"
            @click="cash" variant="outlined" :disabled="emptySelection"></v-btn>
    </v-container>
</template>
<script setup lang="ts">
const { api } = useFeathers()
const route = useRoute()
const cashStore = useCashStore()
const { setNotification, setFetchPending, resetFetchPending } = useUtilityStore()

const tableId = computed(() => {
    return parseInt(route.params.tableId! as string)
})
const table = api.service('tables').getFromStore(tableId)
const { data: orders } = toRefs(api.service('orders').findInStore(computed(() => ({ query: { tableId: tableId.value, finished: true } }))))
const { data: orderedItems } = toRefs(api.service('ordered-items').findInStore(computed(() => ({ query: { orderId: { $in: orders.value.map(({ id }) => id!) }, fullyCashed: false } }))))
const { data: items } = toRefs(api.service('items').findInStore(computed(() => ({ query: { id: { $in: orderedItems.value.map(({ itemId }) => itemId!) } } }))))
const { data: baseItems } = toRefs(api.service('base-items').findInStore(computed(() => ({ query: { id: { $in: items.value.map(({ baseItemId }) => baseItemId!) } } }))))
const { data: sizes } = toRefs(api.service('sizes').findInStore(ref({ query: {} })))
const { data: flavours } = toRefs(api.service('flavours').findInStore(ref({ query: {} })))
const clusteredBaseItems = computed(() => {
    return baseItems.value.map(baseItem => {
        let _items = items.value.filter(({ baseItemId }) => baseItemId === baseItem.id)
        return {
            baseItem,
            items: _items.map(item => {
                let _orderedItems = orderedItems.value.filter(({ itemId }) => itemId === item.id)
                let size = sizes.value.find(({ id }) => id === item.sizeId)
                let flavour = flavours.value.find(({ id }) => id === item.flavourId)
                return {
                    item,
                    size,
                    flavour,
                    orderedItems: _orderedItems,
                    cashable: _orderedItems.reduce((acc, val) => acc + (val.quantity! - val.cashed!), 0),
                    selected: cashStore.selection.value.find(({ baseItemId }) => baseItemId === baseItem.id)?.items.find(({ itemId }) => itemId === item.id)?.amount || 0
                }
            })
        }
    })
})
const emptySelection = computed(() => {
    return cashStore.selection.value.every(({ items }) => items.length === 0 || items.every(({ amount }) => amount === 0))
})

const incrementSelection = function (baseItemId: number, itemId: number, maxAmount: number) {
    let selectedBaseItem = cashStore.selection.value.find(baseItem => baseItemId === baseItem.baseItemId)
    if (!selectedBaseItem) {
        selectedBaseItem = { baseItemId, items: [{ itemId, amount: 1 }] }
        cashStore.selection.value.push(selectedBaseItem)
    } else {
        let selectedItem = selectedBaseItem.items.find(item => item.itemId === itemId)
        if (!selectedItem) {
            selectedItem = { itemId, amount: 1 }
            selectedBaseItem.items.push(selectedItem)
        } else {
            selectedItem.amount += 1
            if (selectedItem.amount > maxAmount) {
                selectedItem.amount = maxAmount
            }
        }
    }
}
const decrementSelection = function (baseItemId: number, itemId: number) {
    let selectedBaseItem = cashStore.selection.value.find(baseItem => baseItemId === baseItem.baseItemId)
    if (selectedBaseItem) {
        let selectedItem = selectedBaseItem.items.find(item => item.itemId === itemId)
        if (selectedItem) {
            selectedItem.amount -= 1
            if (selectedItem.amount < 0) {
                selectedItem.amount = 0
            }
        }  
    }
    cashStore.resetAllSelected()
}
const cash = async function () {
    setFetchPending()
    for (let selectedBaseItem of cashStore.selection.value) {
        for (let selectedItem of selectedBaseItem.items.filter(({ amount }) => amount > 0)) {
            // iterate through the whole selected structure, base items first then each selected item
            // find all ordered items that possibly can be used for cashing
            // they are embedded within the cluster-structure simmilar to the selected structure
            let selectableOrderedItems = clusteredBaseItems.value.find(({ baseItem }) => baseItem.id === selectedBaseItem.baseItemId)!.items.find(({ item }) => item.id === selectedItem.itemId)!
            // iterate over all ordered items that can be used for cashing this specific selected item
            for (let orderedItem of selectableOrderedItems.orderedItems) {
                // determinate the maximal amount cashable for this ordered item
                let maxCashable = orderedItem.quantity! - orderedItem.cashed!
                // evaluate the amount actually cashed for this ordered item based on the selected amount and the maximal cashable amount for this OI
                let cashing = Math.min(maxCashable, selectedItem.amount)
                let clone = orderedItem.clone()
                clone.cashed! += cashing
                if (clone.cashed === clone.quantity) {
                    clone.fullyCashed = true
                }
                await clone.save()
                // reduce the available remaining amount to be cashed for this item by the actual amount cashed
                selectedItem.amount -= cashing
                if (selectedItem.amount === 0) {
                    break
                }
            }
        }
    }
    deselectAll()
    resetFetchPending()
}

const selectAll = function () {
    let newSelection = new Array<{ baseItemId: number, items: Array<{ itemId: number, amount: number }> }>()
    clusteredBaseItems.value.forEach(cluster => {
        let baseItemSelection = { baseItemId: cluster.baseItem.id!, items: new Array<{ itemId: number, amount: number }>() }
        cluster.items.forEach(({ item, cashable }) => {
            baseItemSelection.items.push({ itemId: item.id!, amount: cashable })
        })
        newSelection.push(baseItemSelection)
    })
    cashStore.selection.value = newSelection
}
const deselectAll = function () {
    cashStore.selection.value = []
}
cashStore.registerSelectAllCallback(selectAll)
cashStore.registerDeselectAllCallback(deselectAll)
onBeforeUnmount(() => {
    cashStore.deregisterSelectAllCallback()
    cashStore.deregisterDeselectAllCallback()
    deselectAll()
})
</script>