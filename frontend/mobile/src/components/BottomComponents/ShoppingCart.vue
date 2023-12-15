<template>
    <v-card>
        <v-system-bar window :style="{ top: '0px', backgroundColor: 'rgb(var(--v-theme-surface))' }" v-touch="{ down: () => { emit('closeBottomComponent') } }">
            <v-btn icon class="ms-2" :style="{ backgroundColor: 'transparent', boxShadow: 'none' }"></v-btn>
            <v-spacer></v-spacer>
            <div class="indicator" :style="{ transform: 'rotateZ(10deg) translateX(1.5px)' }" @click.stop="emit('closeBottomComponent')"></div>
            <div class="indicator" :style="{ transform: 'rotateZ(-10deg) translateX(-1.5px)' }" @click.stop="emit('closeBottomComponent')"></div>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" variant="text" class="ms-2" @click.stop="emit('closeBottomComponent')"></v-btn>
        </v-system-bar>
        <v-card-title :style="{ marginTop: '32px' }">Deine Bestellung:</v-card-title>
        <v-card-text :style="{ padding: 0 }">
            <v-list>
                <v-list-item v-for="orderedItem in modifiedOrder" density="compact"
                    :lines="orderedItem.orderedItem.comment ? 'three' : 'two'">
                    <v-list-item-title>
                        {{ orderedItem.baseItem.name }}
                        <span class="ml-2">{{ `( à ${orderedItem.item.price}€ )` }}</span>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ `${orderedItem.flavour.name} | ${orderedItem.size.name}` }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle v-if="orderedItem.orderedItem.comment">
                        {{ orderedItem.orderedItem.comment }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle v-if="!orderedItem.baseItem.available">
                        Ausverkauft!
                    </v-list-item-subtitle>
                    <template #append>
                        <v-btn icon="mdi-minus" @click.stop="decrementOrderedItem(orderedItem.orderedItem.__tempId)"></v-btn>
                        <v-btn variant="outlined" rounded disabled class="text-white" :style="{ opacity: 1 }">{{
                            orderedItem.orderedItem.quantity }}</v-btn>
                        <v-btn icon="mdi-plus" @click.stop="incrementOrderedItem(orderedItem.orderedItem.__tempId)"></v-btn>
                    </template>
                </v-list-item>
                <v-list-item v-if="modifiedOrder.length === 0">
                    <v-alert type="warning" icon="mdi-cart-plus">
                        Dein Warenkorb ist leider leer, wähle Items aus, damit diese bestellt werden können.
                    </v-alert>
                </v-list-item>
                <v-divider></v-divider>
                <v-divider></v-divider>
                <v-divider></v-divider>
                <v-list-item>
                    <v-text-field :model-value="usersettings.getName" @update:model-value="updateName" label="Dein Name"
                        :rules="[(v) => !!v || 'Notwendig!']" variant="outlined" density="compact" hide-details="auto"
                        clearable prepend-icon="mdi-account" class="mt-1"></v-text-field>
                </v-list-item>
                <v-list-item>
                    <v-select :items="tables" :model-value="usersettings.getTableId" @update:model-value="updateTable"
                        label="Tischnummer" :rules="[(v) => !!v || 'Notwendig!']" variant="outlined" density="compact"
                        hide-details="auto" item-title="name" item-value="id" prepend-icon="mdi-table-chair" class="mt-1"></v-select>
                </v-list-item>
                <v-list-item>
                    <v-btn block variant="outlined" prepend-icon="mdi-send" :disabled="!finishable" @click.stop="finishOrder">Bestellung absenden</v-btn>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import moment from 'moment';

const emit = defineEmits<{
    closeBottomComponent: []
}>()
const { api } = useFeathers()
const usersettings = useUsersettings()
const utilities = useUtilityStore()
api.service('tables').find({ query: {} })
const { data: tables } = toRefs(api.service('tables').findInStore(ref({ query: {} })))
const { data: rawOrder } = toRefs(api.service('ordered-items').findInStore(ref({ query: { __isTemp: true }, temps: true })))
const clonedRawOrder = computed(() => {
    return rawOrder.value.map(orderedItem => orderedItem.clone())
})
const modifiedOrder = computed(() => {
    return rawOrder.value.map(orderedItem => {
        orderedItem.__tempId
        let item = api.service('items').findInStore({ query: { id: orderedItem.itemId } }).data[0]
        let baseItem = api.service('base-items').findInStore({ query: { id: item.baseItemId } }).data[0]
        let size = api.service('sizes').findInStore({ query: { id: item.sizeId } }).data[0]
        let flavour = api.service('flavours').findInStore({ query: { id: item.flavourId } }).data[0]
        return {
            orderedItem,
            baseItem,
            size,
            flavour,
            item
        }
    })
})
const finishable = computed(() => {
    if (rawOrder.value.length === 0) {
        return false
    }
    if (modifiedOrder.value.some(({ baseItem }) => !baseItem.available)) {
        return false
    }
    return true
})

const incrementOrderedItem = function (orderedItemId: string) {
    let orderedItem = clonedRawOrder.value.find(({ __tempId }) => __tempId === orderedItemId)
    if (!orderedItem) {
        return
    }
    orderedItem.quantity! += 1
    orderedItem.commit()
}
const decrementOrderedItem = function (orderedItemId: string) {
    let orderedItem = rawOrder.value.find(({ __tempId }) => __tempId === orderedItemId)
    if (!orderedItem) {
        return
    }
    let clone = orderedItem.clone()
    clone.quantity! -= 1
    if (clone.quantity! < 1) {
        orderedItem.removeFromStore()
    } else {
        clone.commit()
    }
}
const updateName = function (newName: string) {
    usersettings.setName(newName)
    clonedRawOrder.value.forEach(orderedItem => {
        orderedItem.waiter = newName
        orderedItem.commit()
    })
}
const updateTable = function (newTableId: number) {
    usersettings.setTableId(newTableId)
    clonedRawOrder.value.forEach(orderedItem => {
        orderedItem.tableId = newTableId
        orderedItem.commit()
    })
}
const finishOrder = async function () {
    utilities.setFetchPending()
    // forcing a sync on FE side since I have not figured out how to properly sync them at backend side, when i have a list of 
    // temporary instances
    // i specifically dont want to go the way with extracting the information of each and every temp instance and sending the 
    // raw data to the backend as an array of data, when i already have all the data in the store,
    // yet there is no method to save multiple instances and send them in one request
    let now = moment().format()
    for (const orderedItem of rawOrder.value) {
        orderedItem.createdAt = now
        await orderedItem.save()
    }
    utilities.resetFetchPending()
    utilities.setNotification({ message: 'Bestellung erfolgreich abgesendet!', type: 'success', timeout: 2000 })
    emit('closeBottomComponent')
}
</script>
<style>
.indicator {
    border-radius: 5px;
    width: 20px;
    height: 10%;
    background-color: rgb(114, 114, 114);
    margin-top: 8px;
    margin-bottom: auto;
}
</style>