<template>
    <router-view />
</template>
<script setup lang="ts">

const { isLoading: isBaseDataLoading, reload: reloadBaseData } = useBaseDataLoader()
const { isLoading: isCashLoading, reload: reloadCash } = useCashLoader()

const fetchInterval = setInterval(() => {
    reloadBaseData()
    reloadCash()
}, 5000)
onBeforeUnmount(() => {
    clearInterval(fetchInterval)
})

</script>
<script lang="ts">
import { useBaseDataLoader } from '@/loader/base-data-loader'
import { useCashLoader } from '@/loader/cash-loader'
export { useBaseDataLoader, useCashLoader }
</script>