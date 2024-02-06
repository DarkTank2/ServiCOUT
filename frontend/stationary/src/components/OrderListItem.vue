<template>
    <v-list-item>
        <template #title>
            <span class="text-h4">{{ `${baseItem?.name}` }}</span>
        </template>
        <template #subtitle>
            <span class="text-h4">{{ `${flavour?.name} | ${size?.name}` }}</span>
            <v-list-item-subtitle v-if="!!orderedItem.comment" style="border: 2px solid #2196f3; border-radius: 4px;" class="pa-2 mt-1">
                <span v-bind="props" class="text-h4">{{ orderedItem.comment }}</span>
                <v-tooltip :text="orderedItem.comment" location="bottom center" activator="parent" :max-width="width / 3" />
            </v-list-item-subtitle>
        </template>
        <template #append>
            <span :class="{ 'text-error': errorState, 'text-h4': !errorState, 'text-h1': errorState }" class="ml-2">{{ quantityDisplay }}</span>
        </template>
    </v-list-item>
</template>
<script setup lang="ts">
import { OrderedItemsData } from 'backend';
import { ServiceInstance } from 'feathers-pinia';

const { width } = useWindowSize()
const { api } = useFeathers()

const errorState = ref(false)

const props = defineProps<{ orderedItem: ServiceInstance<OrderedItemsData> }>()
const item = api.service('items').getFromStore(props.orderedItem.itemId!)
const baseItem = api.service('base-items').getFromStore(computed(() => item.value?.baseItemId! || 0))
const size = api.service('sizes').getFromStore(computed(() => item.value?.sizeId! || 0))
const flavour = api.service('flavours').getFromStore(computed(() => item.value?.flavourId! || 0))
const quantityDisplay = computed(() => {
    if (errorState.value) {
        return 'X'
    }
    return `x ${props.orderedItem.quantity}`
})
</script>
