<template>
    <v-row justify="space-around">
        <v-btn variant="outlined" density="comfortable" prepend-icon="mdi-checkbox-multiple-marked-outline"
            :disabled="route.name !== 'Cash/SingleTable' || allSelected" @click="cashStore.selectAll">Alles</v-btn>
        <v-btn variant="outlined" density="comfortable" prepend-icon="mdi-checkbox-multiple-blank-outline"
            :disabled="route.name !== 'Cash/SingleTable' || selection.filter(({ amount }) => amount > 0).length === 0" @click="cashStore.deselectAll">Nichts</v-btn>
    </v-row>
</template>
<script setup lang="ts">
const route = useRoute()
const cashStore = useCashStore()
const allSelected = computed(() => {
    return cashStore.allSelected
})
const selection = computed(() => {
    return cashStore.selection.value
})
</script>