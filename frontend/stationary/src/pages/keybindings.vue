<template>
    <v-container>
        <v-row justify="center">
            <KeybindingDialog />
        </v-row>
        <v-row justify="center" class="pt-4">
            <!-- <KeybindingTable /> -->
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
definePage({
    meta: {
        requiresAuth: 'admin'
    }
})
const { isLoading } = useCalculatorLoader()
</script>
<script lang="ts">
import { useCalculatorLoader } from '@/loaders/calculator-loader'
export { useCalculatorLoader }
</script>