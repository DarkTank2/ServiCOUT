<template>
    <v-container fluid>
        <span>Calculator</span>
        <GridLayout v-model:layout="layout" :col-num="12" :row-height="30" is-draggable is-resizable vertical-compact
            use-css-transforms>
            <template #item="{ item }">
                <v-card height="100%">
                    <v-card-text>
                        {{ item.i }}
                    </v-card-text>
                </v-card>
            </template>
        </GridLayout>
    </v-container>
</template>
<script setup lang="ts">
import { GridLayout } from 'grid-layout-plus'
const layout = ref([
    { x: 0, y: 0, w: 2, h: 2, i: '0' },
    { x: 2, y: 0, w: 2, h: 4, i: '1' },
    { x: 4, y: 0, w: 2, h: 5, i: '2' },
    { x: 6, y: 0, w: 2, h: 3, i: '3' },
    { x: 8, y: 0, w: 2, h: 3, i: '4' },
])
</script>