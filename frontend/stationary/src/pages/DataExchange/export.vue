<template>
    <v-container>
        <v-stepper :items="['Header-Mapping', 'Datenauswahl', 'Datei-Informationen', 'Vorschau und Download']" color="primary" editable>
            <template #item.1>
                <v-card :title="'Header-Mapping'" max-height="500px">
                    <template #text>
                        <header-mapper v-model="headerModel" :columns="6" :headers="headers" :preview-raw-data="[]" />
                    </template>
                </v-card>
            </template>
            <template #item.2>
                <v-card-title>Datenauswahl</v-card-title>
                <v-card max-height="500px" :style="{ overflowY: 'auto' }">
                    <template #text>
                        <data-selection v-model="dataSelectionModel" />
                    </template>
                </v-card>
            </template>
            <template #item.3>
                <v-card :title="'Datei-Informationen'" max-height="500px">
                    <template #text>
                        <file-information
                            v-model:filename="filenameModel"
                            v-model:header-line="headerLineModel"
                            v-model:delimiter="delimiterModel"/>
                    </template>
                </v-card>
            </template>
            <template #item.4>
                <v-card :title="'Vorschau und Download'">
                    <template #text>
                        <export-preview
                            :data="dataSelectionModel"
                            :header="headerModel"
                            :delimiter="delimiterModel"
                            :filename="filenameModel"
                            :header-line="headerLineModel" />
                    </template>
                </v-card>
            </template>
        </v-stepper>
        
    </v-container>
</template>
<script setup lang="ts">
import type { Header } from '@/components/DataExchange/HeaderMapper.vue';
const headers = ref<Array<Header>>([
    { name: 'Basis-Produkt', key: 'base-item' },
    { name: 'Ausprägung', key: 'flavour' },
    { name: 'Größe', key: 'size' },
    { name: 'Preis', key: 'price' },
    { name: 'Kategorie', key: 'category' },
    { name: 'Kommentar', key: 'comment' }
])
const headerModel = ref<Array<Header>>([])
const dataSelectionModel = ref<Array<number>>([])
const filenameModel = ref<string | null>(null)
const delimiterModel = ref<string | null>(null)
const headerLineModel = ref<boolean>(true)
</script>