<template>
    <v-row justify="space-around">
        <span class="text-h6 px-2">{{ `&sum; ${roundedSum}€` }}</span>
        <v-btn-group variant="outlined" divided density="comfortable">
            <v-btn :disabled="allSelected" @click="cashStore.selectAll"><v-icon icon="mdi-checkbox-multiple-marked-outline"></v-icon>Alles</v-btn>
            <v-btn :disabled="emptySelection" @click="cashStore.deselectAll"><v-icon icon="mdi-checkbox-multiple-blank-outline"></v-icon>Nichts</v-btn>
        </v-btn-group>
    </v-row>
</template>
<script setup lang="ts">
const { api } = useFeathers()
const cashStore = useCashStore()

const { data: items } = toRefs(api.service('items').findInStore(ref({ query: {} })))
const sum = computed(() => {
    return cashStore.selection.value.reduce((acc, baseItem) => {
        return acc + baseItem.items.reduce((_acc, { itemId, amount }) => {
            let item = items.value.find(({ id }) => id === itemId)
            if (!item) {
                return _acc
            } else {
                return _acc + item.price! * amount
            }
        }, 0)
    }, 0)
})
const roundedSum = computed(() => {
    return Math.round(sum.value * 100) / 100
})

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