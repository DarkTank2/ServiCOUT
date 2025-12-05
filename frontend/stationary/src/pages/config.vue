<template>
    <v-container fluid>
        <BaseItemsServiceTable show-id />
        <ItemsServiceTable show-id />
        <SizesServiceTable show-id />
        <CategoriesServiceTable show-id />
    </v-container>
</template>
<script setup lang="ts">
definePage({
    meta: {
        requiresAuth: 'admin'
    }
})
const { isLoading } = useConfigLoader()
</script>
<script lang="ts">
import { useConfigLoader } from '@/loaders/config-loader';
export { useConfigLoader }
</script>