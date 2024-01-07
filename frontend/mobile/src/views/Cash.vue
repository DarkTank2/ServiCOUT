<template>
    <router-view />
</template>
<script setup lang="ts">
const { api } = useFeathers()
const fetchInterval = setInterval(() => {
    fetchOrderedItems(0)
    fetchOrders(0)
}, 3000)
onBeforeUnmount(() => {
    clearInterval(fetchInterval)
})
const fetchOrderedItems = function (_skip: number) {
    api.service('ordered-items').find({ query: { finished: true, fullyCashed: false, $skip: _skip } }).then(({ data, total, skip }) => {
    if (data.length === 0) {
      // empty data, thu no data istransferred and there is no more data
      return
    }
    if (data.length + skip !== total) {
        fetchOrderedItems(data.length + skip)
    }
  })
}
const fetchOrders = function (_skip: number) {
    api.service('orders').find({ query: { $skip: _skip } }).then(({ data, total, skip }) => {
    if (data.length === 0) {
      // empty data, thu no data istransferred and there is no more data
      return
    }
    if (data.length + skip !== total) {
        fetchOrders(data.length + skip)
    }
  })
}
</script>