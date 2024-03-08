<template>
    <v-container fluid>
        <SeparatedWrapper v-if="calculator.separatedMode" />
        <MixedWrapper v-else />
    </v-container>
</template>
<script setup lang="ts">
import SeparatedWrapper from '@/components/Calculator/SeparatedWrapper.vue';
import MixedWrapper from '@/components/Calculator/MixedWrapper.vue'
const calculator = useCalculatorStore()
const fetch = useFetchUtility()
fetch.fetchAllBaseItems({})
fetch.fetchAllCategories({})
fetch.fetchAllFlavours({})
fetch.fetchAllItems({})
fetch.fetchAllSizes({})
fetch.fetchAllTables({})
</script>