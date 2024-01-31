<template>
    <v-container fluid>
        <v-row>
            <v-col v-if="populatedOrders.length === 0" cols="12">
                <v-card>
                    <v-card-title>
                        <span>Gibt grad nix zu sehen ¯\_(ツ)_/¯</span>
                    </v-card-title>
                    <v-card-text>
                        <object data="void.svg" type="image/svg+xml" width="20%"></object>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
const populatedOrders = computed(() => {
    return []
})
</script>