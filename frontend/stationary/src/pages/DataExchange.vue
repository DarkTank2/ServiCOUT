<template>
    <router-view />
</template>
<script setup lang="ts">
definePage({
    name: '/data-exchange',
    path: '/data-exchange',
    meta: {
        requiresAuth: 'user'
    }
})
const { isLoading } = useConfigLoader()
</script>
<script lang="ts">
import { useConfigLoader } from '@/loaders/config-loader'
export { useConfigLoader }
</script>