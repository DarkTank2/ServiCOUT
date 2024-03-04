<template>
    <router-view />
</template>
<script setup lang="ts">

const { api } = useFeathers()
const fetchInterval = setInterval(() => {
    fetchOrderedItems(0)
    fetchOrders(0)
}, 5000)
onMounted(() => {
  fetchOrderedItems(0)
  fetchOrders(0)
})
onBeforeUnmount(() => {
    clearInterval(fetchInterval)
})
const fetchOrderedItems = function (_skip: number) {
  // the following indicates an error, but 'order.finished' is a valid query parameter and is sent successfully to the backend
  // it works as expected  
  api.service('ordered-items').find({ query: { $skip: _skip, open: 0, notCashed: { $gt: 0 } } }).then(({ data, total, skip }) => {
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
    api.service('orders').find({ query: { finished: true, $skip: _skip } }).then(({ data, total, skip }) => {
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