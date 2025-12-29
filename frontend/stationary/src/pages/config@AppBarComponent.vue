<template>
    <v-tooltip>
        <template #activator="{ props }">
            <v-btn v-bind="props" density="compact" variant="outlined" class="mr-4" @click="pSwipe">Productive swipe</v-btn>
        </template>
        <span>Zum zurücksetzen aller Bestellungen. Hierbei werden nur die Bestellungen zurückgesetzt.</span>
    </v-tooltip>
    <v-tooltip>
        <template #activator="{ props }">
            <v-btn v-bind="props" density="compact" variant="outlined" @click="cSwipe">Clean swipe</v-btn>
        </template>
        <span>Zum zurücksetzen aller Daten. Hierbei werden auch die Kategorien, Basis-Produkte, Größen und Ausrichtungen entfernt!</span>
    </v-tooltip>
</template>
<script setup lang="ts">
    const { api } = useFeathers()
    const pSwipe = function () {
        let answer = confirm('Willst du wirklich alle produktiven Einträge (Bestellten Produkte und Bestellungen) löschen?')
        if (!answer) {
            return
        }
        let ois = api.service('ordered-items').findInStore({ query: {} }).data.map(({ id }) => id!)
        ois.forEach(id => api.service('ordered-items').remove(id))
        let os = api.service('orders').findInStore({ query: {} }).data.map(({ id }) => id!)
        os.forEach(id => api.service('orders').remove(id))
    }
    const cSwipe = function () {
        pSwipe()
        let answer = confirm('Willst du wirklich ALLE Entitäten (inklusive Kategorien, Basis-Produkte, Größen und Ausrichtungen) löschen?')
        if (!answer) {
            return
        }
        let items = api.service('items').findInStore({ query: {} }).data.map(({ id }) => id!)
        items.forEach(id => api.service('items').remove(id))
        let sizes = api.service('sizes').findInStore({ query: {} }).data.map(({ id }) => id!)
        sizes.forEach(id => api.service('sizes').remove(id))
        let flavours = api.service('flavours').findInStore({ query: {} }).data.map(({ id }) => id!)
        flavours.forEach(id => api.service('flavours').remove(id))
        let baseItems = api.service('base-items').findInStore({ query: {} }).data.map(({ id }) => id!)
        baseItems.forEach(id => api.service('base-items').remove(id))
        let categories = api.service('categories').findInStore({ query: {} }).data.map(({ id }) => id!)
        categories.forEach(id => api.service('categories').remove(id))
    }
</script>
