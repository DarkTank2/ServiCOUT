<template>
    <v-card class="pa-10" height="100%" flat tile>
        <v-container>
            <v-row dense justify="center">
                <v-col style="text-align: center;">
                    <span class="font-weight-black">HI</span>
                </v-col>
            </v-row>
            <v-row dense justify="center">
                <v-col style="text-align: center;">
                    <span>Ich brauche bitte noch deinen Namen und eine Tischnummer bevor wir hier weitermachen können.</span>
                </v-col>
            </v-row>
            <v-row dense justify="center">
                <v-col>
                    <v-text-field :model-value="settings.getName" @update:model-value="settings.setName"
                        label="Dein Name" :rules="[(v) => !!v || 'Notwendig!']" variant="outlined" density="compact"
                        hide-details="auto" clearable></v-text-field>
                </v-col>
            </v-row>
            <v-row dense justify="center">
                <v-col>
                    <v-select :items="tables" :model-value="mobileSettings.getTableId" @update:model-value="mobileSettings.setTableId"
                        label="Tischnummer" :rules="[(v) => !!v || 'Notwendig!']" variant="outlined" density="compact"
                        hide-details="auto" clearable item-title="name" item-value="id"></v-select>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col style="text-align: center;">
                    <v-alert type="info" title="Nutzung deines Namens" text="Dein Name ist notwendig, damit Fragen zu einer deiner Bestellungen 
                        direkt an dich gestellt werden können."></v-alert>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col>
                    <v-btn :to="{ name: '/order' }" block variant="outlined" :disabled="!(settings.getName && mobileSettings.getTableId)">
                        <span>Weiter zum Bestellen</span>
                        <v-icon icon="mdi-chevron-right"></v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>
<script setup lang="ts">
definePage({
    name: '/name-input',
    path: '/name-input',
    meta: {
        requiresAuth: 'user'
    }
})

const settings = useSettings()
const mobileSettings = useMobileSettings()
const { api } = useFeathers()
api.service('tables').find({ query: {} })
const { data: tables } = toRefs(api.service('tables').findInStore(ref({ query: {} })))
</script>