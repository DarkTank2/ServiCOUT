<template>
    <v-menu ref="dialog" v-model="menu" :close-on-content-click="false" :max-width="400">
        <template #activator="{ props }">
            <v-text-field :label="label" :model-value="displayedDate" v-bind="props" :prepend-inner-icon="icon"
                hide-details readonly @click="initializeDate" clearable @click:clear="clearInput" variant="outlined"></v-text-field>
        </template>
        <v-card>
            <v-date-picker v-model="model" :min="minDate" :max="maxDate" @update:model-value="menu = false" />
        </v-card>
    </v-menu>
</template>
<script setup lang="ts">
interface DatePickerProps {
    label: string,
    minDate?: Date | null,
    maxDate?: Date | null,
    icon?: string
}
const model = defineModel<Date | null>({ required: true })
const props = defineProps<DatePickerProps>()
const menu = ref<boolean>(false)

const initializeDate = function () {
    if (model.value) {
        return
    }
    model.value = new Date()
}
const clearInput = function () {
    model.value = null
}
const displayedDate = computed(() => {
    return model.value?.toDateString()
})
</script>