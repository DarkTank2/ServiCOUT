<template>
    <v-container fluid class="pa-0">
        <v-row>
            <v-col v-for="header in headers" cols="2">
                <v-card :text="header.name" draggable="true" @drag="drag(header)" @dragend="dragEnd(header)"></v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="colNum in Array(columns).fill(1).map((v, i) => v*i)">
                <v-card :title="`#${colNum+1}`" :id="`drop_column_${colNum}`">
                    <v-card-text
                    :key="model[colNum]?.key"
                    style="height: 52px; padding-top: 1rem;"
                    :style="{ borderColor: model[colNum] ? 'rgba(var(--v-theme-primary), 0.7) !important' : 'rgba(var(--v-border-color), var(--v-border-opacity))' }"
                    class="border rounded pa-1"
                    :class="{ 'bg-primary': colNum === activeColumn, 'bg-secondary': editedHeader && editedHeader.key === model[colNum]?.key }">
                        {{ model[colNum] ? model[colNum].name : '' }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-if="previewRawData && previewRawData.length > 0 && previewRawData[0]!.length > 0">
            <v-col>
                <h1>Vorschau</h1>
            </v-col>
            <v-col cols="12">
                <v-table density="compact">
                    <thead>
                        <tr>
                            <td v-for="(_cell, i) in previewRawData[0]">{{ i+1 }}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="line in previewRawData.slice(0, 5)" >
                            <td v-for="cell in line">
                                <span v-if="cell === ''">...</span>
                                <span v-else>{{ cell }}</span>
                            </td>
                        </tr>
                        <tr v-if="previewRawData.length > 5"><td>+{{ previewRawData.length - 5 }} mehr</td></tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import type { ItemsData } from 'backend/lib/services/items/items.shared';
import { throttle } from 'lodash'
import type { VCard } from 'vuetify/components';

export type HeaderKey = 'base-item' | 'flavour' | 'size' | 'price' | 'category' | 'comment'
export interface Header {
    name: string, key: HeaderKey
}
export interface HeaderMapperProps {
    headers: Array<Header>,
    previewRawData: Array<Array<string>>,
    columns: number
}
const props = defineProps<HeaderMapperProps>()
const model = defineModel<Array<Header | undefined>>({ required: true })
const columnSize = computed(() => {
    if (props.columns > 6) {
        return 1
    } else {
        return 2
    }
})

onMounted(() => {
  document.addEventListener('dragover', syncMousePosition)
})
onBeforeUnmount(() => {
  document.removeEventListener('dragover', syncMousePosition)
})
const mouseAt = ref({ x: -1, y: -1 })
function syncMousePosition(event: MouseEvent) {
  mouseAt.value = { x: event.clientX, y: event.clientY }
}

const editedHeader = ref<Header>()
const activeColumn = ref(-1)
const mouseInIndexedGrid = function (gridId: string) {
    let gridCard = document.getElementById(gridId)
    if (!gridCard) {
        return false
    }
    let gridBoundingRect = gridCard.getBoundingClientRect()
    return  mouseAt.value.x > gridBoundingRect.left &&
            mouseAt.value.x < gridBoundingRect.right &&
            mouseAt.value.y > gridBoundingRect.top &&
            mouseAt.value.y < gridBoundingRect.bottom
}
const drag = throttle((header: Header) => {
    editedHeader.value = header
    let mouseContainedInIndex = -1
    for (let colNum of new Array(props.columns).fill(1).map((v, i) => v*i)) {
        let mouseInGrid = mouseInIndexedGrid(`drop_column_${colNum}`)
        if (mouseInGrid) {
            mouseContainedInIndex = colNum
        }
    }
    activeColumn.value = mouseContainedInIndex
})
const dragEnd = function (header: Header) {
    editedHeader.value = undefined
    activeColumn.value = -1
    let mouseContainedInIndex = -1
    for (let colNum of new Array(props.columns).fill(1).map((v, i) => v*i)) {
        let mouseInGrid = mouseInIndexedGrid(`drop_column_${colNum}`)
        if (mouseInGrid) {
            mouseContainedInIndex = colNum
        }
    }
    if (mouseContainedInIndex === -1) {
        return
    }
    let foundIndex = model.value.findIndex(val => {
        if (!val) {
            return false
        }
        return val.name === header.name && val.key === header.key
    })
    if (foundIndex !== -1) {
        delete model.value[foundIndex]
    }
    model.value[mouseContainedInIndex] = header
    mouseAt.value = { x: -1, y: -1 }
}
</script>