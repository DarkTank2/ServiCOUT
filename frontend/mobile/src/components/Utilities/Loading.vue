<template>
    <v-overlay :value="utilities.fetchPending">
        <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
</template>
<script setup lang="ts">
import { useUtilityStore } from '../../store/utility-store'
let utilities = useUtilityStore()
</script>
