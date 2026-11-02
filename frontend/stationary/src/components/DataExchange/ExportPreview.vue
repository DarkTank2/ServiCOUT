<template>
    <v-card elevation="5">
        <template #title>
            <v-icon icon="mdi-file-outline"></v-icon>
            {{ assembledFilename }}
        </template>
        <template #text v-if="!isDataValid">
            <v-alert variant="outlined" type="info" :text="noDataText"></v-alert>
        </template>
        <template #text v-if="!isHeaderValid">
            <v-alert variant="outlined" type="info" :text="headerErrorText"></v-alert>
        </template>
        <template #text v-if="isDataValid && isHeaderValid">
            <v-alert v-if="!isDelimiterValid" variant="outlined" type="error" :text="delimiterErrorText"></v-alert>
            <v-list v-else density="compact">
                <v-list-item v-for="line in assembledData.slice(0, 5)" :title="line"></v-list-item>
                <v-list-item :title="`+${assembledData.length - 5} mehr`"></v-list-item>
            </v-list>
            <!-- <v-alert v-if="isDelimiterValid" type="success" variant="outlined" :text="noticeText"></v-alert> -->
        </template>
        <template #actions v-if="isDataValid && isHeaderValid && isDelimiterValid">
            <v-spacer></v-spacer>
            <v-btn @click="download"><v-icon icon="mdi-download"></v-icon>Download</v-btn>
        </template>
    </v-card>
</template>
<script setup lang="ts">
import moment from 'moment';
import type { Header } from './HeaderMapper.vue';
const { api } = useFeathers()

interface ExportPreviewProps {
    data: Array<number>,
    header: Array<Header | undefined>,
    filename: string | null,
    delimiter: string | null,
    headerLine: boolean
}
const props = defineProps<ExportPreviewProps>()

const delimiterErrorText = ref('Für eine Vorschau muss ein Trennzeichen ausgewählt sein!')
const noDataText = ref('Es sind keine Daten ausgewählt. Wähle Daten aus, die exportiert werden sollen!')
const headerErrorText = ref('Header sind ungültig. Wähle gültige Header aus!')
const noticeText = computed(() => `Es werden nur die ersten fünf Zeilen (inklusive einer Header-Zeile) angezeigt! Es werden jedoch alle ausgewählten Daten (${props.data.length}) exportiert!`)

const assembledFilename = computed(() => {
    return (props.filename || moment().format('YYYY-MM-DD')) + '.csv'
})
const assembledData = computed(() => {
    if (!props.delimiter) {
        return []
    }
    let data: Array<string> = []
    if (props.headerLine) {
        data.push(props.header.map(header => header ? header.name : '').join(props.delimiter) + props.delimiter)
    }
    for (let itemId of props.data) {
        let rawLine: Array<string> = []
        let item = api.service('items').getFromStore(itemId).value
        let baseItem = api.service('base-items').getFromStore(item.baseItemId!).value
        let category = api.service('categories').getFromStore(baseItem.categoryId!).value
        let flavour = api.service('flavours').getFromStore(item.flavourId!).value
        let size = api.service('sizes').getFromStore(item.sizeId!).value
        for (let header of props.header) {
            if (!header) {
                rawLine.push('')
                continue
            }
            let { key } = header!
            if (key === 'base-item') {
                rawLine.push(baseItem.name!)
            }
            if (key === 'category') {
                rawLine.push(category.name!)
            }
            if (key === 'comment') {
                rawLine.push(baseItem.description || '')
            }
            if (key === 'flavour') {
                rawLine.push(flavour.name!)
            }
            if (key === 'price') {
                rawLine.push(item.price!.toString())
            }
            if (key === 'size') {
                rawLine.push(size.name!)
            }
        }
        data.push(rawLine.join(props.delimiter!) + props.delimiter)
    }
    return data
})

const isDataValid = computed(() => {
    return props.data.length > 0
})
const isHeaderValid = computed(() => {
    return props.header.length > 0
})
const isDelimiterValid = computed(() => {
    return !!props.delimiter
})

const download = function () {
    let data = assembledData.value.join('\r\n')
    let element = document.createElement('a')
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data))
    element.setAttribute('download', assembledFilename.value)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    element.remove()
}
</script>