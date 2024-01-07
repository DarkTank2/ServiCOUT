<template>
    <v-row style="padding: 20px;">
        <v-col cols="12" style="text-align: center;">
            <v-card v-if="category" style="border: thin solid;" class="rounded-pill" :id="`category_${props.categoryId}`">
                <v-card-text class="text-center">
                    {{ category.name }}
                    <!-- <span v-if="disabled">( Deaktiviert )</span> -->
                </v-card-text>
            </v-card>
            <v-skeleton-loader v-else type="heading"></v-skeleton-loader>
        </v-col>
        <v-col v-if="baseItems.length > 0" v-for="baseItem in baseItems"
            :key="`category_${props.categoryId}_base_item_id_${baseItem.id}`" cols="6" style="padding: 2px;">
            <SingleItem :item-id="baseItem.id!" :disabled="!category.active || !baseItem.available" :style="colorGradient">
                <template #external-disable-message v-if="!category.active">
                    <span>( -> Buffet )</span>
                </template>
            </SingleItem>
        </v-col>
        <v-col v-else v-for="n in 4" :key="`category_${props.categoryId}_placeholder_${n}`" cols="6" style="padding: 2px;">
            <v-skeleton-loader type="image" style="aspect-ratio: 1;"></v-skeleton-loader>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import SingleItem from './SingleItem.vue';
import colors from 'vuetify/util/colors'
import type { CSSProperties } from 'vue';

const props = defineProps<{
    categoryId: number
}>()
const interval = ref<NodeJS.Timeout>()
const { api } = useFeathers()

const { data: baseItems } = toRefs(api.service('base-items').findInStore(ref({ query: { categoryId: props.categoryId } })))
const category = api.service('categories').getFromStore(toRef(props.categoryId))

const colorGradient = computed(() => {
    let styleObject: CSSProperties = {
        aspectRatio: 1
    }
    if (!category.value.active) {
        styleObject.background = colors.grey.base
    } else if (category.value.color) {
        styleObject.background = `linear-gradient(180deg, ${category.value.color}79 0%, ${category.value.color}98 30%, ${category.value.color}FF 100%)`
    }
    return styleObject
})

</script>
<style>
div.v-skeleton-loader__bone.v-skeleton-loader__image {
    height: 100%;
    border-radius: 4px;
}
</style>