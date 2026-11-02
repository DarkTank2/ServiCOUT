<template>
    <v-container fluid>
        <BaseItemsServiceTable :hide-properties="['tenantId']" deny-creation />
    </v-container>
</template>
<script setup lang="ts">
definePage({
    name: '/item-manager',
    path: '/item-manager',
    meta: {
        requiresAuth: 'admin'
    }
})
const { isLoading } = useSubscriptionLoader()
</script>
<script lang="ts">
import { useSubscriptionLoader } from '@/loaders/subscription-loader'
export { useSubscriptionLoader }
</script>