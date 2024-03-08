<template>
    <v-container fluid>
        <span>Calculator</span>
        <SingleCategory :category-id="1" :use-quick-mode="false" />
        <SingleCategory :category-id="1" :use-quick-mode="true" />
    </v-container>
</template>
<script setup lang="ts">
import SingleCategory from '@/components/Calculator/SingleCategory.vue';
const fetch = useFetchUtility()
fetch.fetchAllBaseItems({})
fetch.fetchAllCategories({})
fetch.fetchAllFlavours({})
fetch.fetchAllItems({})
fetch.fetchAllSizes({})
fetch.fetchAllTables({})
</script>