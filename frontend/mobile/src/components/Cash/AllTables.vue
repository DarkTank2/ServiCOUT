<template>
    <v-list>
        <v-list-item v-if="populatedTables.length === 0" v-for="n in 15" variant="outlined" rounded class="ma-2">
            <v-list-item-title>
                <v-skeleton-loader type="text"></v-skeleton-loader>
            </v-list-item-title>
        </v-list-item>
        <v-list-item v-for="{ table, cashable } in populatedTables" :key="`cash_table_id_${table.id}`"
            :variant="cashable ? 'outlined' : 'tonal'" :to="{ name: 'Cash/SingleTable', params: { tableId: table.id } }"
            rounded class="ma-2" :disabled="!cashable">
            <v-list-item-title>{{ table.name }}</v-list-item-title>
            <template #append>
                {{ cashable }}
            </template>
        </v-list-item>
    </v-list>
</template>
<script setup lang="ts">
const { api } = useFeathers()
const { data: tables } = toRefs(api.service('tables').findInStore(ref({ query: {} })))
const { data: finishedItems } = toRefs(api.service('ordered-items').findInStore(ref({ query: { finished: true, fullyCashed: false } })))
const { data: orders } = toRefs(api.service('orders').findInStore(computed(() => ({ query: { id: { $in: finishedItems.value.map(({ orderId }) => orderId!) } } }))))
const populatedTables = computed(() => {
    let data = tables.value.map(table => {
        let orderedItems = finishedItems.value.filter(({ orderId }) => orders.value.find(({ id }) => id === orderId)?.tableId === table.id)
        return {
            table,
            cashable: orderedItems.reduce((acc, val) => acc + (val.quantity! - val.cashed!), 0)
        }
    })
    console.log(data)
    return data
})
</script>