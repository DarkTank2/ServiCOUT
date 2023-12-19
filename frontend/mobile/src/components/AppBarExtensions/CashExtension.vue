<template>
    <v-row justify="space-around">
        <v-btn variant="outlined" density="comfortable" prepend-icon="mdi-checkbox-multiple-marked-outline" :disabled="route.name !== 'Cash/SingleTable'">Alles</v-btn>
        <v-btn variant="outlined" density="comfortable" prepend-icon="mdi-checkbox-multiple-blank-outline" :disabled="route.name !== 'Cash/SingleTable'">Nichts</v-btn>
    </v-row>
</template>
<script setup lang="ts">
const route = useRoute()
</script>