<template>
    <v-container>
        <v-stepper v-model="step" :items="['Dateiauswahl', 'Spalten-Mapping', 'Data-Review', 'Kontrolle und Import']" color="primary">
            <template #item.1>
                <v-card :title="'Dateiauswahl'" max-height="500px">
                    <template #text>
                        <file-input @update="handleFileInput" />
                    </template>
                </v-card>
            </template>
            <template #item.2>
                <v-card :title="'Header-Mapping'" max-height="500px">
                    <template #text>
                        <header-mapper v-model="headerModel" :columns="headerModel.length" :headers="headers" :preview-raw-data="fileContent" />
                    </template>
                </v-card>
            </template>
            <template #item.3>
                <data-review v-model="reducedFileContent" v-model:selection="lineSelectionModel" :header="headerModel.filter(h => h !== undefined)" />
            </template>
            <template #item.4>
                <import-helper :data="reducedFileContent.filter((_, i) => lineSelectionModel.includes(i))" :header="headerModel.filter(h => h !== undefined)" />
            </template>
            <template #actions="{ next, prev }">
                <v-stepper-actions>
                    <template #prev>
                        <v-btn @click="prev">zurück</v-btn>
                    </template>
                    <template #next>
                        <v-btn @click="next" :disabled="!enabledNextButton">weiter</v-btn>
                    </template>
                </v-stepper-actions>
            </template>
        </v-stepper>
        
    </v-container>
</template>
<script setup lang="ts">
import type { Header } from '@/components/DataExchange/HeaderMapper.vue';
type Matrix<T> = Array<Array<T>>
const headers = ref<Array<Header>>([
    { name: 'Basis-Produkt', key: 'base-item' },
    { name: 'Ausprägung', key: 'flavour' },
    { name: 'Größe', key: 'size' },
    { name: 'Preis', key: 'price' },
    { name: 'Kategorie', key: 'category' },
    { name: 'Kommentar', key: 'comment' }
])
const step = ref(0)
const headerModel = ref<Array<Header | undefined>>([])
const fileContent = ref<Matrix<string>>([])
const reducedFileContent = ref<Matrix<string>>([])
const headerLineIncludedModel = ref(true)
const lineSelectionModel = ref<Array<number>>([])

const handleFileInput = function (value: Matrix<string>, headerLineIncluded: boolean) {
    fileContent.value = value
    let headerLine = value[0]!
    headerModel.value = Array(headerLine.length).fill(undefined)
    if (!headerLineIncluded) {
        headerLineIncludedModel.value = false
        return
    }
    headerLineIncludedModel.value = true
    if (value.length === 0) {
        return
    }
    headerLine.forEach((hcell, i) => {
        let foundHeader = headers.value.find(({ name }) => name === hcell)
        headerModel.value[i] = foundHeader
    })
}

const enabledNextButton = computed(() => {
    if (step.value === 1) {
        return fileContent.value.length > 0 && fileContent.value.every(line => line.length > 0)
    }
    if (step.value === 2) {
        return headers.value.every(h => {
            return headerModel.value.find(m => m && m.key === h.key)
        })
    }
    if (step.value === 3) {
        return lineSelectionModel.value.length > 0
    }
    return false
})

watch(headerModel, (newVal) => {
    reducedFileContent.value = []
    fileContent.value.forEach((line, l_i) => {
        if (headerLineIncludedModel.value && l_i === 0) return
        let newLine: Array<string> = []
        line.forEach((c, c_i) => {
            newVal.forEach((h, i) => {
                if (!h) return
                if (c_i === i) {
                    newLine.push(c)
                }
            })
        })
        reducedFileContent.value?.push(newLine)
    })
}, { deep: true })
</script>