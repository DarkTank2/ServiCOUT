<template>
    <span class="text-h3">{{ time }}</span>
</template>
<script setup lang="ts">
import moment from "moment"
const time = ref('')
const showColon = ref(true)
const interval = ref<NodeJS.Timeout>()
const cb = function () {
    time.value = moment().format(`HH${showColon.value ? ':' : ' '}mm`)
    showColon.value = !showColon.value
}
onMounted(() => {
    interval.value = setInterval(cb, 1000)
})
onBeforeUnmount(() => {
    clearInterval(interval.value)
})
</script>