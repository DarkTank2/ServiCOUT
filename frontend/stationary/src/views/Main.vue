<template>
    <v-container fluid>
        <v-row>
            <v-col v-if="orders.length === 0" cols="12">
                <v-card class="d-flex align-center flex-column pa-14">
                    <Void width="20%"></Void>
                    <v-card-title>
                        <span class="text-h3">Gibt grad nix zu sehen ¯\_(ツ)_/¯</span>
                    </v-card-title>
                </v-card>
            </v-col>
            <OrderWrapper v-for="order in orders" :order-id="order.id!" :key="`wrapper_order_id_${order.id}`"/>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import Void from '@/components/svg/Void.vue'
import OrderWrapper from '@/components/OrderWrapper.vue';
const { api } = useFeathers()
const { fetchAllOrders, fetchAllOrderedItems, fetchAllBaseItems, fetchAllSizes, fetchAllFlavours, fetchAllItems } = useFetchUtility()
fetchAllOrders({ finished: false })
fetchAllOrderedItems({ open: { $gt: 0 } })
api.service('tables').find({ query: { $limit: 100 } })
fetchAllBaseItems({})
fetchAllSizes({})
// fetchAllOptions({})
fetchAllFlavours({})
fetchAllItems({})
api.service('tenants').find({ query: { id: 2 } })

const { data: orders } = toRefs(api.service('orders').findInStore(computed(() => ({ query: { finished: false } }))))
</script>