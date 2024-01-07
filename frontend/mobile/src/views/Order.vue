<template>
    <v-card height="100%">
        <v-container>
            <SingleCategory v-if="categories.length === 0" :category-id="0" />
            <SingleCategory v-if="categories.length === 0" :category-id="0" />
            <SingleCategory v-else v-for="category in categories" :key="`single_category_${category.id}`" :category-id="category.id!"></SingleCategory>
        </v-container>
    </v-card>
</template>
<script setup lang="ts">
import SingleCategory from '@/components/Order/SingleCategory.vue';
const { api } = useFeathers()
const interval = setInterval(() => {
    fetchCategories(0)
}, 3000)
onBeforeUnmount(() => {
    clearInterval(interval)
})
const { data: categories } = toRefs(api.service('categories').findInStore(ref({ query: {} })))
const fetchCategories = function (_skip: number) {
    api.service('categories').find({ query: { $skip: _skip } }).then(({ data, skip, total }) => {
        if (data.length === 0) {
            return
        }
        if (data.length + skip !== total) {
            // not the end, fetch more
            fetchCategories(data.length + skip)
        }
    })
}
</script>