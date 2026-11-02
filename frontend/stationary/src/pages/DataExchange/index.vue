<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="3">
                <v-btn block :to="{ name: '/DataExchange/import' }">
                    <v-icon icon="mdi-import"></v-icon>
                    <span>Daten importieren</span>
                </v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn block :to="{ name: '/DataExchange/export' }">
                    <v-icon icon="mdi-export"></v-icon>
                    <span>Daten exportieren</span>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
definePage({
    name: '/data-exchange/'
})
</script>