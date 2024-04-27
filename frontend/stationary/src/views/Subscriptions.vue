<template>
    <v-card height="100%">
        <v-container>
            <span>
                In den Abonnements können die angezeigten Basis-Produkte ausgewählt werden. Dabei können sowohl
                ganze Kategorien ausgewählt werden, als auch einzelne Produkte. Basierend auf der Auswahl werden dann
                Produkte in der Hauptansicht der Station aufscheinen. Blau markiert sind bereits ausgewählte Produkte,
                alle weiß markierten Bereiche können ausgewählt werden.
            </span>
            <br />
            <span>
                Derzeit sind {{ usersetting.getSubscriptions.length }} Produkte ausgewählt!
            </span>
            <br />
            <span>
                Wenn du fertig bist, kannst du <v-btn density="compact" variant="outlined" @click="routeBack">hier</v-btn> zu deiner Anwendung gelangen!
            </span>
            <Category v-for="category in categories" :key="`single_category_${category.id}`" :id="category.id!" />
        </v-container>
    </v-card>
</template>
<script setup lang="ts">
import Category from '@/components/Subscriptions/Category.vue';
const { api } = useFeathers()
const { fetchAllBaseItems, fetchAllCategories } = useFetchUtility()
const usersetting = useUsersettings()
const utilities = useUtilityStore()
const router = useRouter()
fetchAllBaseItems({})
fetchAllCategories({})
const { data: categories } = toRefs(api.service('categories').findInStore(computed(() => ({ query: {} }))))
const routeBack = function () {
    if (utilities.storedRoute) {
        router.push(utilities.storedRoute)
    }
}
</script>