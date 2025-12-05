<template>
    <div @click="openShoppingCart" :style="{ cursor: 'pointer' }">
        <span class="text-h6">&sum;</span>
        <span class="text-h6 px-2">{{ beautifiedPrice }}€</span>
    </div>
</template>
<script setup lang="ts">

const { api } = useFeathers()
const { openShoppingCart } = useCalculatorStore()
// the implementation has a bug where the return-type is wrongly set to Paginate<never>, tho it should be ComputedRef<number> as by the documentation
const countItems = api.service('items').countInStore(computed(() => ({ query: {} }))) as any as ComputedRef<number>
const { data: allItems } = toRefs(api.service('items').findInStore(computed(() => ({ query: { $limit: countItems.value } }))))
const countTempOrderedItems = api.service('ordered-items').countInStore(computed(() => ({ query: { __isTemp: true }, temps: true }))) as any as ComputedRef<number>
const { data: allTempOrderedItems } = toRefs(api.service('ordered-items').findInStore(computed(() => ({ query: { __isTemp: true, $limit: countTempOrderedItems.value }, temps: true }))))
const rawPrice = computed(() => {
    return allTempOrderedItems.value.reduce((acc, val) => {
        let item = allItems.value.find(({ id }) => id === val.itemId)
        if (!item) {
            return acc
        }
        return acc + item.price! * val.quantity!
    }, 0)
})
const beautifiedPrice = computed(() => {
    return Math.round(rawPrice.value * 100) / 100
})
</script>