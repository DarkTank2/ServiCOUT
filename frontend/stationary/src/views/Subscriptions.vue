<template>
    <v-card height="100%">
        <v-container>
            <Category v-for="category in categories" :key="`single_category_${category.id}`" :id="category.id!" />
        </v-container>
    </v-card>
</template>
<script setup lang="ts">
import Category from '@/components/Subscriptions/Category.vue';
const { api } = useFeathers()
const { fetchAllBaseItems, fetchAllCategories } = useFetchUtility()
fetchAllBaseItems({})
fetchAllCategories({})
const { data: categories } = toRefs(api.service('categories').findInStore(computed(() => ({ query: {} }))))
</script>