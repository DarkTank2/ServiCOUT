<template>
    <v-card @click.stop="claimOrder" :style="{ border: `thin solid ${claim === true ? 'red' : 'transparent'}` }">
        <template #title>
            <span :class="{ 'text-error': claim, 'text-success': !claim }">
                {{ title }}
            </span>
        </template>
        <template #text>
            <v-row no-gutters>
                <template v-for="column, i in columns">
                    <v-divider v-if="i !== 0" vertical></v-divider>
                    <v-col :cols="12 / columns.length">
                        <v-list lines="two">
                            <template v-for="orderedItem, index in column">
                                <v-divider v-if="index !== 0"></v-divider>
                                <order-list-item :ordered-item="orderedItem" />
                            </template>
                        </v-list>
                    </v-col>
                </template>
            </v-row>
        </template>
        <template #actions>
            <v-btn :loading="loading" block prepend-icon="mdi-send" variant="outlined"
                @click.stop="finishOrder">Fertigstellen</v-btn>
        </template>
    </v-card>
</template>
<script setup lang="ts">
import { TablesData } from 'backend';
import { OrdersData } from 'backend';
import { OrderedItemsData } from 'backend';
import { ServiceInstance } from 'feathers-pinia';

import OrderListItem from './OrderListItem.vue';

const { api } = useFeathers()
type PopulatedOrder = {
    order: ServiceInstance<OrdersData>,
    table: ServiceInstance<TablesData>,
    orderedItems: Array<ServiceInstance<OrderedItemsData>>,
    size: 4 | 8 | 12
}
const props = defineProps<PopulatedOrder>()
const claim = ref(false)
const loading = ref(false)

const title = computed(() => {
    return `${props.order.waiter} | ${props.table.name}`
})
const columnSize = computed(() => {
    // size must be the actual cards column size, it must be a multiple of 4, thus a max of 3 orders can be displayes in one line
    return Math.floor(props.size / 4)
})
const columns = computed(() => {
    if (props.size === 12) {
        let data = new Array<Array<ServiceInstance<OrderedItemsData>>>()
        data.push(props.orderedItems.filter((_, index) => index < props.orderedItems.length / 3))
        data.push(props.orderedItems.filter((_, index) => index >= props.orderedItems.length / 3 && index < props.orderedItems.length * 2 / 3))
        data.push(props.orderedItems.filter((_, index) => index >= props.orderedItems.length * 2 / 3))
        return data
    } else if (props.size === 8) {
        let data = new Array<Array<ServiceInstance<OrderedItemsData>>>()
        data.push(props.orderedItems.filter((_, index) => index < props.orderedItems.length / 2))
        data.push(props.orderedItems.filter((_, index) => index >= props.orderedItems.length / 2))
        return data
    } else {
        return [props.orderedItems]
    }
})
const finishOrder = async function () {
    loading.value = true
    let clone = props.order.clone()
    clone.finished = true
    await clone.save({ eager: true })
    loading.value = false
}
const claimOrder = function () {
    claim.value = !claim.value
}

</script>