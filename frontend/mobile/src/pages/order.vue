<template>
    <v-card>
        <v-container>
            <SingleCategory v-if="categories.length === 0" :category-id="0" />
            <SingleCategory v-if="categories.length === 0" :category-id="0" />
            <SingleCategory v-else v-for="category in categories" :key="`single_category_${category.id}`" :category-id="category.id!"></SingleCategory>
            <SingleCategory :category-id="0" />
            <SingleCategory :category-id="0" />
            <SingleCategory :category-id="0" />
            <SingleCategory :category-id="0" />
            <SingleCategory :category-id="0" />
            <SingleCategory :category-id="0" />
        </v-container>
        <v-fab app location="bottom right" size="large" icon @click="shoppingCartModel = true" style="bottom: 60px;">
            <v-icon icon="mdi-cart"></v-icon>
        </v-fab>
        <v-bottom-sheet v-model="shoppingCartModel" scrollable>
            <ShoppingCart @close-bottom-component="shoppingCartModel = false" />
        </v-bottom-sheet>
    </v-card>
</template>
<script setup lang="ts">
definePage({
    meta: {
        requiresAuth: 'user'
    },
    beforeEnter: _to => {
        const settings = useSettings()
        const mobileSettings = useMobileSettings()
        if (!settings.getName || !mobileSettings.getTableId) {
            return { name: '/name-input' }
        }
        return true
    }
})

const { isLoading: isBaseDataLoading, reload: reloadBaseData } = useBaseDataLoader()
const { isLoading: isOrderDataLoading, reload: reloadOrderData } = useOrderLoader()

const { api } = useFeathers()
const interval = setInterval(() => {
    // fetchAllCategories({})
    reloadBaseData()
    reloadOrderData()
}, 10000)
onBeforeUnmount(() => {
    clearInterval(interval)
})
const { data: categories } = toRefs(api.service('categories').findInStore(ref({ query: {} })))

const shoppingCartModel = ref(false)

</script>
<script lang="ts">
import { useOrderLoader } from '@/loader/order-loader';
import { useBaseDataLoader } from '@/loader/base-data-loader';
export { useOrderLoader, useBaseDataLoader }
</script>