<template>
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-btn icon="mdi-cog" v-bind="props" variant="outlined" />
        </template>
        <v-list density="compact">
            <v-tooltip location="bottom">
                <template #activator="{ props: tProps }">
                    <v-list-item v-bind="tProps">
                        <v-switch :model-value="calculator.quickMode" @update:model-value="calculator.updateQuickMode" :label="quickModeLabel" color="primary" hide-details></v-switch>
                    </v-list-item>
                </template>
                <span>{{ quickModeTooltip }}</span>
            </v-tooltip>
            <v-tooltip location="bottom">
                <template #activator="{ props: tProps }">
                    <v-list-item v-bind="tProps">
                        <v-switch :model-value="calculator.separatedMode" @update:model-value="calculator.updateSeparateMode" :label="separatedModeLabel" color="primary" hide-details></v-switch>
                    </v-list-item>
                </template>
                <span>{{ separatedModeTooltip }}</span>
            </v-tooltip>
            <v-tooltip location="bottom">
                <template #activator="{ props: tProps }">
                    <v-list-item v-bind="tProps">
                        <v-switch :model-value="calculator.editMode" @update:model-value="calculator.updateEditMode" :label="editModeLabel" color="primary" hide-details></v-switch>
                    </v-list-item>
                </template>
                <span>{{ editModeTooltip }}</span>
            </v-tooltip>
            <v-list-item v-if="calculator.editMode">
                <v-btn block variant="outlined" prepend-icon="mdi-plus">
                    Add empty El.
                </v-btn>
            </v-list-item>
        </v-list>
    </v-menu>
</template>
<script setup lang="ts">
const calculator = useCalculatorStore()
const quickModeLabel = ref('Schneller Modus')
const quickModeTooltip = ref('Im Schnellen Modus werden Produkte in all ihren Variationen einzeln agezeigt. Wird so ein Produkt ausgewählt, so wird es direkt einmal zum Warenkorb hinzugefügt. Ist der Schnelle Modus nicht aktiviert, so werden alle Basis-Produkte angezeigt. In diesem Fall wird bei einer Auswahl erst noch ein Fenster geöffnet, in dem die genaue Ausführung des Produktes ausgewählt werden muss.')
const separatedModeLabel = ref('Getrennte Kategorien')
const separatedModeTooltip = ref('Über diese Einstellung kann ausgewählt werden, ob alle angezeigten Produkte/Basis-Produkte zusammen angezeigt werden sollen, oder in ihren Kategorien getrennt sein sollen.')
const editModeLabel = ref('Anordnung bearbeiten')
const editModeTooltip = ref('Mit diesem Schalter kannst du den Modus umschalten, indem die einzelnen (Basis-)Produkte verschoben und in der Größe verändert werden können.')
</script>