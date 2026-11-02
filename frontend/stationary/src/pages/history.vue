<template>
    <v-container>
        <v-card>
            <template #title>
                <h1>Historie</h1>
                <v-col cols="12" sm="3">
                    <v-select v-model="waiter" :items="names" label="Name"></v-select>
                </v-col>
            </template>
            <template #text>
                <HistoryBase :waiter="waiter" />
            </template>
        </v-card>
    </v-container>
</template>
<script setup lang="ts">
const { isLoading, reload } = useHistoryLoader()
const { api } = useFeathers()
const settings = useUsersettings()

const { data: orders } = toRefs(api.service('orders').findInStore(computed(() => ({}))))
const waiter = ref<string>()

const names = computed(() => {
    return [...new Set(orders.value.map(order => {
        return order.waiter
    }))]
})

onMounted(() => {
    let self = settings.getName
    if (self) {
        waiter.value = self
    }
})
</script>
<script lang="ts">
import { useHistoryLoader } from '@/loaders/history-loader'
export { useHistoryLoader }
</script>