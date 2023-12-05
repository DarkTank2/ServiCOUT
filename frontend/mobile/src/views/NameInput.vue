<template>
    <v-card class="pa-14" height="100%" flat tile>
        <v-container>
            <v-row dense justify="center">
                <v-col style="text-align: center;">
                    <span class="font-weight-black">HI</span>
                </v-col>
            </v-row>
            <v-row dense justify="center">
                <v-col style="text-align: center;">
                    <span>Ich brauche bitte noch deinen Namen bevor wir hier weitermachen können.</span>
                </v-col>
            </v-row>
            <v-row dense justify="center">
                <v-col>
                    <v-text-field :model-value="usersettings.getName" @update:model-value="usersettings.setName"
                        label="Dein Name" :rules="[(v) => !!v || 'Notwendig!']" variant="outlined" density="compact"
                        hide-details="auto" clearable></v-text-field>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col style="text-align: center;">
                    <v-alert type="info" title="Nutzung deines Namens" text="Dein Name ist notwendig, damit Fragen zu einer deiner Bestellungen 
                        direkt an dich gestellt werden können."></v-alert>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>
<script setup lang="ts">
const usersettings = useUsersettings()
</script>