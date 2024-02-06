<template>
    <v-container fluid>
        <BaseItemsServiceTable show-id />
        <SizesServiceTable show-id />
    </v-container>
</template>
<script setup lang="ts">
import BaseItemsServiceTable from '@/components/ServiceTables/BaseItemsServiceTable.vue';
import SizesServiceTable from '@/components/ServiceTables/SizesServiceTable.vue'

const { fetchAll } = useFetchUtility()
fetchAll()

</script>