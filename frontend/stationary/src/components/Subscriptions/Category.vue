<template>
    <v-row style="padding: 20px;">
        <v-col cols="12" style="text-align: center;">
            <v-card v-if="category" style="border: thin solid;" class="rounded-pill" :id="`category_${props.id}`" @click="toggleSubscribedCategory(props.id)">
                <v-card-text class="text-center">
                    {{ category.name }}
                </v-card-text>
            </v-card>
            <v-skeleton-loader v-else type="heading"></v-skeleton-loader>
        </v-col>
        <v-col v-if="baseItems.length > 0" v-for="baseItem in baseItems"
            :key="`category_${props.id}_base_item_id_${baseItem.id}`" cols="2" style="padding: 2px;">
            <BaseItem :id="baseItem.id!" />
        </v-col>
        <v-col v-else v-for="n in 4" :key="`category_${props.id}_placeholder_${n}`" cols="2" style="padding: 2px;">
            <v-skeleton-loader type="list-item" ></v-skeleton-loader>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import BaseItem from './BaseItem.vue';
const { api } = useFeathers()
const { toggleSubscribedCategory } = useUsersettings()
interface CategoryProps {
    id: number
}
const props = defineProps<CategoryProps>()
const category = api.service('categories').getFromStore(props.id)
const { data: baseItems } = toRefs(api.service('base-items').findInStore(computed(() => ({ query: { categoryId: props.id } }))))
</script>