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
const { data: orders } = toRefs(api.service('orders').findInStore(computed(() => ({ query: { finished: true } }))))
const { data: finishedItems } = toRefs(api.service('ordered-items').findInStore(computed(() => ({ query: { orderId: { $in: orders.value.map(({ id }) => id!) }, fullyCashed: false } }))))
const populatedTables = computed(() => {
    let data = tables.value.map(table => {
        let ordersOnTable = orders.value.filter(({ tableId }) => tableId === table.id).map(({ id }) => id)
        let orderedItems = finishedItems.value.filter(({ orderId }) => {
            return ordersOnTable.includes(orderId)
        })
        return {
            table,
            cashable: orderedItems.reduce((acc, val) => acc + (val.quantity! - val.cashed!), 0)
        }
    })
    return data
})
</script>