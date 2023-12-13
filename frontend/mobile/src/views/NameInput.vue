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
                    <v-text-field :model-value="usersettings.getName" @update:model-value="usersettings.setName"
                        label="Dein Name" :rules="[(v) => !!v || 'Notwendig!']" variant="outlined" density="compact"
                        hide-details="auto" clearable></v-text-field>
                </v-col>
            </v-row>
            <v-row dense justify="center">
                <v-col>
                    <v-select :items="tables" :model-value="usersettings.getTableId" @update:model-value="usersettings.setTableId"
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
                    <v-btn :to="{ name: 'Order' }" block variant="outlined" :disabled="!(usersettings.getName && usersettings.getTableId)">
                        <span>Weiter zum Bestellen</span>
                        <v-icon icon="mdi-chevron-right"></v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>
<script setup lang="ts">
const usersettings = useUsersettings()
const { api } = useFeathers()
api.service('tables').find({ query: {} })
const { data: tables } = toRefs(api.service('tables').findInStore(ref({ query: {} })))
</script>