<template>
    <HistoryOrderWrapper v-for="order in orders" :key="`history_order_id_${order.id}`" :order-id="order.id!">

    </HistoryOrderWrapper>
</template>
<script setup lang="ts">
const { api } = useFeathers()
interface HistoryBaseProps {
    waiter: string | undefined
}
const props = defineProps<HistoryBaseProps>()

const { data: orders } = toRefs(api.service('orders').findInStore(computed(() => ({
    query: {
        waiter: props.waiter,
        $sort: {
            id: -1
        }
    }
}))))
</script>