<template>
    <v-slide-group show-arrows class="mx-2">
        <v-slide-group-item v-if="categories.length > 0" v-for="category in categories"
            :key="`category_extension_slider_chip_${category.id}`" v-slot="{ isSelected, toggle }">
            <v-btn rounded :color="isSelected ? 'primary' : undefined" @click="toggle" variant="outlined">
                {{ category.name }}
            </v-btn>
        </v-slide-group-item>
        <v-slide-group-item v-else v-for="n in 5" :key="`category_skeleton_loader_${n}`">
            <v-skeleton-loader width="150px" type="chip" />
        </v-slide-group-item>
    </v-slide-group>
</template>
<script setup lang="ts">
const { api } = useFeathers()
const { data: categories } = toRefs(api.service('categories').findInStore(ref({ query: {  } })))
</script>