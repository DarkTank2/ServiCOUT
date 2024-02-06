<template>
    <v-container fluid>
        <BaseItemsServiceTable :hide-properties="['tenantId']" />
    </v-container>
</template>
<script setup lang="ts">
import BaseItemsServiceTable from '@/components/ServiceTables/BaseItemsServiceTable.vue';
const { fetchAllBaseItems, fetchAllCategories } = useFetchUtility()
fetchAllBaseItems({})
fetchAllCategories({})
</script>