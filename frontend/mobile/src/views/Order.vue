<template>
    <v-card height="100%">
        <v-container>
            <span>{{ allCategories.data.map(({ name }) => name).join(', ') }}</span>
        </v-container>
    </v-card>
</template>
<script setup lang="ts">
const { api } = useFeathers()
const categoryService = api.service('categories')
categoryService.find()

const allCategories = categoryService.findInStore(ref({ query: {} }))
</script>