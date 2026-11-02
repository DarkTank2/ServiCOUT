<template>
    <v-list-item>
        <template #title>
            <div style="width: 100%;" class="d-flex">
                <div style="flex-grow: 1;">
                    <p class="text-h5">ID:</p>
                    <span class="text-medium-emphasis">{{ order.id }}</span>
                </div>
                <div style="flex-grow: 1;">
                    <p class="text-h5">Aufgenommen durch:</p>
                    <span class="text-medium-emphasis">{{ order.waiter }}</span>
                </div>
                <div style="flex-grow: 1;" class="mr-2 pt-2">
                    <!-- <p class="text-h5">Tisch:</p> -->
                    <!-- <span class="text-medium-emphasis">{{ order.tableId }}</span> -->
                    <v-select label="Tisch" :model-value="order.tableId" :items="tables" item-value="id" item-title="name" @update:model-value="changeTable" hide-details density="compact"></v-select>
                </div>
                <div style="flex-grow: 1;">
                    <p class="text-h5">Fertig gestellt:</p>
                    <v-switch color="primary" :model-value="order.finished" @update:model-value="changeFinished" hide-details density="compact"></v-switch>
                </div>
                <div style="flex-grow: 1;">
                    <p class="text-h5">Erstellt um:</p>
                    <span class="text-medium-emphasis">{{ order.createdAt }}</span>
                </div>
            </div>
        </template>
        <template #append>
            <span class="text-h5">{{ sum }}€</span>
        </template>
    </v-list-item>
</template>
<script setup lang="ts">
const { api } = useFeathers()
interface HistoryOrderHeaderProps {
    order: {
        id?: number,
        tableId?: number,
        waiter?: string,
        createdAt?: string
    },
    sum: number | string
}
const props = defineProps<HistoryOrderHeaderProps>()
const order = api.service('orders').getFromStore(props.order.id!)
const { data: tables } = api.service('tables').findInStore(computed(() => ({})))
const changeFinished = function (newVal: boolean | null) {
    if (newVal === null) return
    let cloned = order.value.clone()
    cloned.finished = newVal
    cloned.save()
}
const changeTable = function (newVal: number | null) {
    if (newVal === null) return
    let cloned = order.value.clone()
    cloned.tableId = newVal
    cloned.save()
}
</script>