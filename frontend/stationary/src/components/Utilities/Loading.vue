<template>
    <v-overlay :model-value="utilities.fetchPending" class="align-center justify-center">
        <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
</template>
<script setup lang="ts">
let utilities = useUtilityStore()
</script>
