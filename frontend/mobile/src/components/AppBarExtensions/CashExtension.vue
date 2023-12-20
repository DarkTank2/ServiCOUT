<template>
    <v-row justify="space-around">
        <v-btn variant="outlined" density="comfortable" prepend-icon="mdi-checkbox-multiple-marked-outline"
            :disabled="route.name !== 'Cash/SingleTable' || allSelected" @click="cashStore.selectAll">Alles</v-btn>
        <v-btn variant="outlined" density="comfortable" prepend-icon="mdi-checkbox-multiple-blank-outline"
            :disabled="route.name !== 'Cash/SingleTable' || emptySelection" @click="cashStore.deselectAll">Nichts</v-btn>
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
const emptySelection = computed(() => {
    return selection.value.every(({ items }) => items.length === 0 || items.every(({ amount }) => amount === 0))
})
</script>