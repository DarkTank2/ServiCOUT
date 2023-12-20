<template>
    <v-container fluid>
        <template v-for="({ baseItem, items }, index) in clusteredBaseItems">
            <v-divider v-if="index !== 0"></v-divider>
            <v-row>
                <v-col cols="8">
                    <v-list-item :title="baseItem.name"></v-list-item>
                </v-col>
            </v-row>
            <v-row justify="end" class="mb-2">
                <template v-for="{ size, flavour, cashable, item, selected } in items">
                    <v-col cols="9">
                        <v-list-item variant="outlined" rounded
                            @click="incrementSelection(item.id!, cashable)" :disabled="selected === cashable">
                            <v-list-item-subtitle style="opacity: 1 !important;">
                                {{ `${size?.name} | ${flavour?.name} | á ${item.price}€` }}
                            </v-list-item-subtitle>
                            <template #append>
                                {{ cashable }}
                            </template>
                        </v-list-item>
                    </v-col>
                    <v-divider vertical></v-divider>
                    <v-col cols="2">
                        <v-btn block variant="outlined" height="100%" @click="decrementSelection(item.id!)"
                            :disabled="selected === 0">{{ selected }}</v-btn>
                    </v-col>
                </template>
            </v-row>
        </template>
    </v-container>
</template>
<script setup lang="ts">
const { api } = useFeathers()
const route = useRoute()
const cashStore = useCashStore()

const tableId = computed(() => {
    return parseInt(route.params.tableId! as string)
})
const table = api.service('tables').getFromStore(tableId)
// get all not fully cashed ordered items
const { data: notFullyCashedOrderedItems } = toRefs(api.service('ordered-items').findInStore(computed(() => ({ query: { finished: true, fullyCashed: false } }))))
// now get the orders for that table based on the not finished items
// the orders will now only contain orders that are not 100% finished
const { data: notFullyCashedOrders } = toRefs(api.service('orders').findInStore(computed(() => ({ query: { tableId: tableId.value, id: { $in: notFullyCashedOrderedItems.value.map(({ orderId }) => orderId!) } } }))))
// now get all ordered items that are not finished for the orders on this table
const { data: orderedItems } = toRefs(api.service('ordered-items').findInStore(computed(() => ({ query: { finished: true, fullyCashed: false, orderId: { $in: notFullyCashedOrders.value.map(({ id }) => id!) } } }))))
// get the items of the ordered items
const { data: items } = toRefs(api.service('items').findInStore(computed(() => ({ query: { id: { $in: orderedItems.value.map(({ itemId }) => itemId!) } } }))))
// get the baseItems of the open ordered items on this table
const { data: baseItems } = toRefs(api.service('base-items').findInStore(computed(() => ({ query: { id: { $in: items.value.map(({ baseItemId }) => baseItemId!) } } }))))
// sort the not fully cashed ordered items by their base item so they can be displayed accordingly
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
                    selected: cashStore.selection.value.find(({ itemId }) => itemId === item.id)?.amount || 0
                }
            })
        }
    })
})

const incrementSelection = function (itemId: number, maxAmount: number) {
    let selection = cashStore.selection.value.find(selection => selection.itemId === itemId)
    if (!selection) {
        selection = { itemId, amount: 1 }
        cashStore.selection.value.push(selection)
    } else {
        selection.amount += 1
        if (selection.amount > maxAmount) {
            selection.amount = maxAmount
        }
    }
}
const decrementSelection = function (itemId: number) {
    let selection = cashStore.selection.value.find(selection => selection.itemId === itemId)
    if (selection) {
        selection.amount -= 1
        if (selection.amount < 0) {
            selection.amount = 0
        }
    }
    cashStore.resetAllSelected()
}

const selectAll = function () {
    let newSelection = new Array<{ itemId: number, amount: number }>()
    clusteredBaseItems.value.forEach(cluster => {
        cluster.items.forEach(({ item, cashable }) => {
            newSelection.push({ itemId: item.id!, amount: cashable })
        })
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