<template>
    <v-card class="pa-2 my-2">
        <v-card-title class="d-flex align-center pe-2">
            <span>Größen</span>

            <v-spacer></v-spacer>

            <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" density="compact" label="Search" single-line
                flat hide-details variant="solo-filled"></v-text-field>
        </v-card-title>

        <v-divider></v-divider>
        <v-data-table :items="clonedItems" :search="search"
            :headers="[...headers, { value: 'action', title: 'Bearbeiten', width: '60px', align: 'center' }]">
            <template v-for="header in headers" #[`item.${header.value}`]="{ item }">
                <v-text-field v-if="header.type === 'string'" v-model="item[header.value]" :readonly="header.readonly"
                    :density="'compact'" @update:model-value="save(item)" />
                <v-text-field v-if="header.type === 'number'" :type="'number'" v-model="item[header.value]"
                    :readonly="header.readonly" :density="'compact'" @update:model-value="save(item)" />
                <v-switch v-if="header.type === 'boolean'" v-model="item[header.value]" :readonly="header.readonly"
                    :density="'compact'" @update:model-value="save(item)" color="primary" />
                <v-select v-if="header.type === 'select'" :items="header.selectFrom" v-model="item[header.value]"
                    item-value="id" item-title="name" :density="'compact'" @update:model-value="save(item)" />
            </template>
            <template #[`item.action`]="{ item }">
                <v-progress-circular v-if="loadingStore[item.id]" indeterminate></v-progress-circular>
                <v-icon v-else size="small" @click="remove(item)">
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
    </v-card>
</template>
<script setup lang="ts">
import { ServiceTypes } from 'backend';
import { BaseItemsData } from 'backend';
type DataType = BaseItemsData
const serviceName: keyof ServiceTypes = 'base-items'

const { api } = useFeathers()
interface ServiceTableProps {
    hideProperties?: [keyof DataType],
    readonlyProperties?: ['id', keyof DataType]
    showId?: boolean,
    denyCreation?: boolean
}
interface I {
    value: 'id' | keyof DataType,
    readonly?: boolean,
    title?: string,
    type: 'string' | 'number' | 'boolean' | 'select',
    selectFrom?: Array<any>,
    width?: string
}
const timers = ref<{ [key: number]: NodeJS.Timeout }>({})
const errors = ref<{ [key: number]: string }>({})
const search = ref<string>('')

const props = withDefaults(defineProps<ServiceTableProps>(), {
    showId: false
})
const loadingStore = computed(() => {
    return api.service(serviceName).store.patchPendingById
})
const items = computed(() => {
    return api.service(serviceName).store.items as Array<any>
})
const clonedItems = computed(() => {
    return items.value.map(item => item.clone())
})
const headers = computed(() => {
    let headers: Array<I> = [{
        value: 'id',
        readonly: true,
        title: 'ID',
        type: 'number',
        width: '100px'
    }, {
        value: 'name',
        readonly: true,
        title: 'Name des Produkts',
        type: 'string'
    }, {
        value: 'categoryId',
        readonly: true,
        title: 'Kategorie',
        type: 'select',
        selectFrom: api.service('categories').store.items as Array<any>
    }, {
        value: 'description',
        readonly: true,
        title: 'Beschreibung',
        type: 'string'
    }, {
        value: 'available',
        readonly: true,
        title: 'Verfügbar?',
        type: 'boolean'
    }, {
        value: 'tenantId',
        readonly: true,
        title: 'Tenant',
        type: 'select',
        selectFrom: api.service('tenants').store.items as Array<any>
    }]

    return headers.filter(({ value }) => {
        if (value === 'id') {
            return props.showId
        } else {
            return !props.hideProperties?.includes(value)
        }
    }).map(header => {
        if (header.value !== 'id') {
            if (!props.readonlyProperties?.includes(header.value)) {
                header.readonly = false
            }
        }
        return header
    })
})
const save = function (item: any) {
    let id = item.id as number
    if (timers.value[id]) {
        clearTimeout(timers.value[id])
    }
    timers.value[id] = setTimeout(() => {
        if (timers.value[id]) {
            clearTimeout(timers.value[id])
        }
        clearError(id)
        item.save().catch((err: Error) => {
            errors.value[id] = err.message
        })
    }, 1000)
}
const clearError = function (itemId: number) {
    if (errors.value[itemId]) {
        delete errors.value[itemId]
    }
}
const remove = function (item: any) {

}
</script>