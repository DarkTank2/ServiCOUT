<template>
    <v-card height="100%">
        <v-container>
            <SingleCategory v-for="category in categories" :key="`single_category_${category.id}`" :category-id="category.id!"></SingleCategory>
        </v-container>
    </v-card>
</template>
<script setup lang="ts">
import SingleCategory from '@/components/Order/SingleCategory.vue';
const { api } = useFeathers()
const categoryService = api.service('categories')
categoryService.find()

const { data: categories } = toRefs(categoryService.findInStore(ref({ query: {} })))
</script>