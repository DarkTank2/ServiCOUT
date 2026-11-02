<template>
    <MixedLayout v-if="calculator.quickMode" :use-quick-mode="true" />
    <MixedLayout v-else :use-quick-mode="false" />
</template>
<script setup lang="ts">
const calculator = useCalculatorStore()
</script>