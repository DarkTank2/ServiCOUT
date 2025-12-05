<template>
    <v-slide-group show-arrows class="mx-2">
        <v-slide-group-item v-if="categories.length > 0" v-for="category in categories"
            :key="`category_extension_slider_chip_${category.id}`" v-slot="{ isSelected, toggle }">
            <v-btn rounded @click="toggle" variant="outlined" class="mx-1" @click.stop="scrollToCategory(category.id!)" v-ripple="{ class: `text-primary` }">
                {{ category.name }}
            </v-btn>
        </v-slide-group-item>
        <v-slide-group-item v-else v-for="n in 5" :key="`category_skeleton_loader_${n}`">
            <v-skeleton-loader type="chip" width="120px" max-width="120px"/>
        </v-slide-group-item>
    </v-slide-group>
</template>
<script setup lang="ts">
const { api } = useFeathers()
const router = useRouter()
const route = useRoute()
const { data: categories } = toRefs(api.service('categories').findInStore(ref({ query: {  } })))
const scrollToCategory = function (categoryId: number) {
    router.push({ name: route.name!, hash: `#category_${categoryId}` })
}
</script>