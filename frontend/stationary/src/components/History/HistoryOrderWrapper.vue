<template>
    <v-list class="border rounded-lg pa-4 my-2">
        <HistoryOrderHeader :order="populatedOrder.order" :sum="populatedOrder.sum" />
        <v-divider></v-divider>
        <v-list-item>
            <v-table>
                <thead>
                    <tr>
                        <td v-for="header in ['Kateorie', 'Größe', 'Produkt', 'Ausrichtung', 'preis', 'Menge', 'Offen', 'Nicht bezahlt']">{{
                            header }}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="oi in populatedOrder.orderedItems">
                        <td>
                            <v-chip label>
                                <span :style="{ color: oi.category.color }">{{ oi.category.name }}</span>
                            </v-chip>
                        </td>
                        <td>
                            <span>{{ oi.size.name }}</span>
                        </td>
                        <td>
                            <span>{{ oi.baseItem.name }}</span>
                        </td>
                        <td>
                            <span>{{ oi.flavour.name }}</span>
                        </td>
                        <td>
                            <span>à {{ oi.item.price }}€</span>
                        </td>
                        <td>
                            <v-number-input :model-value="oi.orderedItem.quantity" control-variant="split" variant="outlined" density="compact" :min="0" :step="1" hide-details @update:model-value="val => updateOI(oi.orderedItem,'quantity', val)"></v-number-input>
                        </td>
                        <td>
                            <v-number-input :model-value="oi.orderedItem.open" control-variant="split" variant="outlined" density="compact" :min="0" :max="oi.orderedItem.quantity" :step="1" hide-details @update:model-value="val => updateOI(oi.orderedItem,'open', val)"></v-number-input>
                        </td>
                        <td>
                            <v-number-input :model-value="oi.orderedItem.notCashed" control-variant="split" variant="outlined" density="compact" :min="0" :max="oi.orderedItem.quantity" :step="1" hide-details @update:model-value="val => updateOI(oi.orderedItem,'notCashed', val)"></v-number-input>
                        </td>
                    </tr>
                </tbody>
            </v-table>
            <div style="width: 100%;" class="d-flex justify-center">
                <v-select v-model="selectedBaseItemId" label="Hinzufügen eines Produktes" :items="allBaseItems" item-title="name" item-value="id" :disabled="loading" width="20vw" clearable></v-select>
                <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
            </div>
        </v-list-item>
        <HistoryBaseItemSelectionDialog :base-item-id="selectedBaseItemId" @selected="addToOrder" @clear="selectedBaseItemId = undefined" />
    </v-list>
</template>
<script setup lang="ts">
const { api } = useFeathers()
const usersettings = useUsersettings()
interface HistoryOrderWrapperProps {
    orderId: number
}
const props = defineProps<HistoryOrderWrapperProps>()

const loading = ref(false)

const selectedBaseItemId = ref<number>()

const { data: allBaseItems } = toRefs(api.service('base-items').findInStore(computed(() => ({}))))
const order = api.service('orders').getFromStore(props.orderId)

const populatedOrder = computed(() => {
    let ois = api.service('ordered-items').findInStore({ query: { orderId: props.orderId } }).data.map(orderedItem => {
        let item = api.service('items').getFromStore(orderedItem.itemId!).value
        const baseItem = api.service('base-items').getFromStore(item.baseItemId!).value
        const category = api.service('categories').getFromStore(baseItem.categoryId!).value
        const size = api.service('sizes').getFromStore(item.sizeId!).value
        const flavour = api.service('flavours').getFromStore(item.flavourId!).value
        return {
            orderedItem: orderedItem.clone(),
            item,
            baseItem,
            category,
            size,
            flavour,
            displayName: usersettings.getDisplayName(size.name, baseItem.name, flavour.name)
        }
    })
    return {
        order: order.value,
        orderedItems: ois,
        sum: ois.map(({ item: { price }, orderedItem: { quantity } }) => price! * quantity!).reduce((acc, val) => acc + val, 0).toFixed(2)
    }
})

const addToOrder = async function (itemId: number, quantity: number) {
    loading.value = true
    await api.service('ordered-items').create({ orderId: props.orderId, tenantId: order.value.tenantId!, quantity, itemId, open: 0, notCashed: 0 })
    selectedBaseItemId.value = undefined
    loading.value = false
}
const updateOI = function (oi: any, key: string, value: number) {
    oi[key] = value
    oi.save()
}
</script>