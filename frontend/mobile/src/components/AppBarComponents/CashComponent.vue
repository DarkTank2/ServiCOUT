<template>
    <span class="text-h6 bordered px-2" style="border-color: white !important;">{{ `&sum; ${roundedSum}€` }}</span>
</template>
<script setup lang="ts">
const cashStore = useCashStore()
const { api } = useFeathers()
const { data: items } = toRefs(api.service('items').findInStore(ref({ query: {} })))
const sum = computed(() => {
    return cashStore.selection.value.reduce((acc, { itemId, amount }) => {
        let item = items.value.find(({ id }) => id === itemId)
        if (!item) {
            return acc
        } else {
            return acc + item.price! * amount
        }
    }, 0)
})
const roundedSum = computed(() => {
    return Math.round(sum.value * 100) / 100
})
</script>