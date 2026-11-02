<template>
    <v-container fluid>
        <SeparatedWrapper v-if="calculator.separatedMode" />
        <MixedWrapper v-else />
    </v-container>
</template>
<script setup lang="ts">

definePage({
    meta: {
        requiresAuth: 'admin'
    }
})
useCalculatorLoader()
const calculator = useCalculatorStore()
const { setStoredRoute } = useUtilityStore()

onMounted(() => {
    setStoredRoute({ path: '/calculator' })
})
</script>
<script lang="ts">
import { useCalculatorLoader } from '@/loaders/calculator-loader'
export { useCalculatorLoader }
</script>