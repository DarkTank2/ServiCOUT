<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn icon="mdi-cog" v-bind="props" />
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
        </v-list>
    </v-menu>
</template>
<script setup lang="ts">
const calculator = useCalculatorStore()
const quickModeLabel = ref('Schneller Modus')
const quickModeTooltip = ref('Im Schnellen Modus werden Produkte in all ihren Variationen einzeln agezeigt. Wird so ein Produkt ausgewählt, so wird es direkt einmal zum Warenkorb hinzugefügt. Ist der Schnelle Modus nicht aktiviert, so werden alle Basis-Produkte angezeigt. In diesem Fall wird bei einer Auswahl erst noch ein Fenster geöffnet, in dem die genaue Ausführung des Produktes ausgewählt werden muss.')
const separatedModeLabel = ref('Getrennte Kategorien')
const separatedModeTooltip = ref('Über diese Einstellung kann ausgewählt werden, ob alle angezeigten Produkte/Basis-Produkte zusammen angezeigt werden sollen, oder in ihren Kategorien getrennt sein sollen.')
</script>