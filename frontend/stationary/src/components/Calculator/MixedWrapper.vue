<template>
    <MixedLayout v-if="calculator.quickMode" :use-quick-mode="true" />
    <MixedLayout v-else :use-quick-mode="false" />
</template>
<script setup lang="ts">
import MixedLayout from './MixedLayout.vue'
const calculator = useCalculatorStore()
</script>