<template>
    <v-container fluid>
        <v-row>
            <v-col cols="3">
                <v-text-field v-model="filenameModel" label="Dateiname" :placeholder="placeholder" persistent-placeholder suffix=".csv"></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-select v-model="delimiterModel" :items="delimiter" label="Trennzeichen"></v-select>
            </v-col>
            <v-col>
                <v-switch v-model="headerLineModel" label="Header-Zeile hinzufügen" color="primary"></v-switch>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import moment from 'moment';

const filenameModel = defineModel<string | null>('filename', { required: true })
const delimiterModel = defineModel<string | null>('delimiter', { required: true })
const headerLineModel = defineModel<boolean>('headerLine', { required: true })

const placeholder = ref(`${moment().format('YYYY-MM-DD')}`)
const delimiter = ref<Array<{ title: string, value: ';' | ',' }>>([
    { title: 'Semicolon (;)', value: ';' },
    { title: 'Colon (,)', value: ',' }
])
</script>