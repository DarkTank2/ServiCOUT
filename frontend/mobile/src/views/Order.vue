<template>
    <v-card height="100%">
        <v-container>
            
        </v-container>
    </v-card>
</template>
<script setup lang="ts">
const { api } = useFeathers()
const categoryService = api.service('categories')
categoryService.find()

const { data: categories } = toRefs(categoryService.findInStore(ref({ query: {} })))
</script>