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

const fetchOrders = function (_skip: number) {
    api.service('orders').find({ query: { finished: false, $skip: _skip } }).then(({ data, skip, total }) => {
        if (data.length === 0) {
            return
        }
        if (data.length + skip !== total) {
            // not the end, fetch more
            fetchOrders(data.length + skip)
        }
    })
}
const fetchOrderedItems = function (_skip: number) {
    api.service('ordered-items').find({ query: { cashed: 0, $skip: _skip, "order.finished": false } }).then(({ data, skip, total }) => {
        if (data.length === 0) {
            return
        }
        if (data.length + skip !== total) {
            // not the end, fetch more
            fetchOrderedItems(data.length + skip)
        }
    })
}
fetchOrders(0)
fetchOrderedItems(0)

const { data: orders } = toRefs(api.service('orders').findInStore(computed(() => ({ query: { finished: false } }))))
</script>