<template>
    <v-col v-if="table && order && orderedItems.length > 0" :cols="size">
        <OrderCard :order="order" :ordered-items="orderedItems" :table="table" :size="size" />
    </v-col>
</template>
<script setup lang="ts">

import OrderCard from './OrderCard.vue';

const { api } = useFeathers()
const { height } = useWindowSize()

type OrderContainer = {
    orderId: number
}
const props = defineProps<OrderContainer>()
const order = api.service('orders').getFromStore(props.orderId)
const table = api.service('tables').getFromStore(order.value.tableId!)
const { data: orderedItems } = toRefs(api.service('ordered-items').findInStore(computed(() => ({ query: { orderId: props.orderId } }))))
const size = computed(() => {
    const appBarHeight = 64
    const containerPadding = 16 + 16
    const titleHeight = 10 + 32 + 10 // padding-top + content-height + padding-bottom
    const buttonHeight = 8 + 36 + 8 // padding-top + content-height + padding-bottom
    const cardTextPadding = 0 + 16 // padding-top + paddin-bottom only of card-text
    const rowMargin = 0 + 0 // since property 'no-gutters' is applied, no margin is applied to the dom-element
    const listPadding = 8 + 8 // padding for list element top and bottom
    const listElements = [
        104, // list element wihtout comment, just item-name, size and flavour
        168, // list element with one line of comment
        208 // list element with very long comment, comment is over two lines
    ]
    const commentBreakpoints = 20 // the exact breakpoint for the comment cannot be determined easily since it is not a monospace font
    let calculatedHeight = titleHeight
        + (cardTextPadding + rowMargin + listPadding)
        + orderedItems.value.map(orderedItem => {
            return !orderedItem.comment ? listElements[0] : (orderedItem.comment.length > commentBreakpoints ? listElements[2] : listElements[1])
        }).reduce((acc, val) => acc + val, 0)
        + buttonHeight
    console.log(`Order: ${order.value.id}: calculated height = ${calculatedHeight}`)
    if ((height.value - appBarHeight - containerPadding) < calculatedHeight) {
        if ((height.value - appBarHeight - containerPadding) < calculatedHeight/2) {
            return 12
        }
        return 8
    }
    return 4
})
</script>