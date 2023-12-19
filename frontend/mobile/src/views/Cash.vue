<template>
    <router-view />
</template>
<script setup lang="ts">
const { api } = useFeathers()
const fetchInterval = setInterval(() => {
    api.service('ordered-items').find({ query: { finished: true, fullyCashed: false } })
    api.service('orders').find({ query: {} })
}, 3000)
onBeforeUnmount(() => {
    clearInterval(fetchInterval)
})
</script>