<template>
    <v-menu ref="dialog" v-model="menu" :close-on-content-click="false" :max-width="400">
        <template #activator="{ props }">
            <v-text-field :label="label" :model-value="model" v-bind="props" :prepend-inner-icon="icon"
                hide-details readonly @click="initializeTime" clearable @click:clear="clearInput" variant="outlined"></v-text-field>
        </template>
        <v-card>
            <v-time-picker v-model="model" :min="minTime" :max="maxTime" @update:model-value="menu = false" format="24hr" />
        </v-card>
    </v-menu>
</template>
<script setup lang="ts">
import moment from 'moment'
interface TimePickerProps {
    label: string,
    minTime?: string,
    maxTime?: string,
    icon?: string
}
const model = defineModel<string | undefined>({ required: true })
const props = defineProps<TimePickerProps>()
const menu = ref<boolean>(false)

const initializeTime = function () {
    if (model.value) {
        return
    }
    model.value = moment().format('HH:mm')
}
const clearInput = function () {
    model.value = undefined
}
</script>