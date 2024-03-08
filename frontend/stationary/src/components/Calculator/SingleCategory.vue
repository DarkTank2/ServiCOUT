<template>
    <v-row style="padding: 20px;" v-if="props.useQuickMode === calculator.quickMode">
        <v-col cols="12" style="text-align: center;">
            <v-card v-if="category" style="border: thin solid;" class="rounded-pill"
                :id="`category_${props.categoryId}`">
                <v-card-text class="text-center">
                    {{ category.name }}
                </v-card-text>
            </v-card>
            <v-skeleton-loader v-else type="heading"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" v-if="true">
            <GridLayout v-model:layout="usedLayout" @layout-updated="handleLayoutUpdateEvent" :col-num="12"
                :row-height="30" is-draggable is-resizable vertical-compact use-css-transforms>
                <template #item="{ item }">
                    <SingleBaseItem v-if="props.useQuickMode === false" :base-item-id="item.i"></SingleBaseItem>
                    <SingleItem v-if="props.useQuickMode === true" :item-id="item.i"></SingleItem>
                </template>
            </GridLayout>
        </v-col>
        <v-col v-else v-for="n in 9" :key="`category_${props.categoryId}_placeholder_${n}`" cols="2"
            style="padding: 2px;">
            <v-skeleton-loader type="image" style="aspect-ratio: 1;"></v-skeleton-loader>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { GridLayout, Layout } from 'grid-layout-plus'
import SingleBaseItem from './SingleBaseItem.vue';
import SingleItem from './SingleItem.vue';

const { api } = useFeathers()
const usersettings = useUsersettings()
const calculator = useCalculatorStore()

interface SingleCategoryProps {
    categoryId: number,
    useQuickMode: boolean
}
const props = defineProps<SingleCategoryProps>()

const category = api.service('categories').getFromStore(toRef(props.categoryId))
const { data: baseItems } = toRefs(api.service('base-items').findInStore(computed(() => ({ query: { categoryId: props.categoryId, id: { $in: usersettings.subscriptions } } }))))
const { data: items } = toRefs(api.service('items').findInStore(computed(() => ({ query: { baseItemId: { $in: baseItems.value.map(({ id }) => id!) } } }))))

const storedQuickLayout = computed(() => {
    return calculator.quickSeparatedLayout.find(({ categoryId }) => categoryId === props.categoryId)?.layout || []
})
const filteredQuickLayout = computed(() => {
    return storedQuickLayout.value.filter(({ i }) => items.value.map(({ id }) => id).includes(i as number))
})
const redundantQuickElements = computed(() => {
    return storedQuickLayout.value.filter(({ i }) => !items.value.map(({ id }) => id).includes(i as number))
})
const storedNormalLayout = computed(() => {
    return calculator.normalSeparatedLayout.find(({ categoryId }) => categoryId === props.categoryId)?.layout || []
})
const filteredNormalLayout = computed(() => {
    return storedNormalLayout.value.filter(({ i }) => baseItems.value.map(({ id }) => id).includes(i as number))
})
const redundantNormalElements = computed(() => {
    return storedNormalLayout.value.filter(({ i }) => !baseItems.value.map(({ id }) => id).includes(i as number))
})
const usedLayout = computed(() => {
    return props.useQuickMode ? filteredQuickLayout.value : filteredNormalLayout.value
})
const setupLayout = function () {
    // strategy for the layout is the following
    // as for the model ALWAYS use the stored layout
    // this ensures that changes are always done via the store thus are also stored in the localstorage and there
    // will not be multiple copies of the layout stored somewhere -> only one true stored layout at any given time
    // if there is a change in either the items, baseitems or layout, always run the checks and maybe recalculate the layout
    // analyze the missing and redundant items

    // only start if the items/base-items are loaded and the subscription ready
    if (usersettings.subscriptions.length === 0) {
        // in this case the subscriptions are empty, thus no calculations should be done
        return
    }
    if (items.value.length === 0 || baseItems.value.length === 0) {
        return
    }

    if (props.useQuickMode) {
        // analyzing current layout, get items that are in the layout but should not be (redundant) and get items that should be but are not (missing)
        const { missingIds } = getLayoutDiff(storedQuickLayout.value, items.value.map(({ id }) => id!))
        // // remove redundant items from layout
        // let cleanedLayout = storedQuickLayout.value.filter(({ i }) => !redundantIds.includes(i))
        // add missing items
        if (missingIds.length !== 0 /*|| redundantIds.length !== 0*/) {
            let newLayout = [...storedQuickLayout.value]
            missingIds.forEach(id => {
                newLayout.push({
                    x: (newLayout.length * 2) % 12, // extracted from documentation
                    y: newLayout.length + 12, // it will always be added at the bottom
                    w: 2,
                    h: 4,
                    i: id
                })
            })
            // layout got changed so update it in the store
            calculator.updateQSL(newLayout, props.categoryId)
        }
    } else {
        const { missingIds } = getLayoutDiff(storedNormalLayout.value, baseItems.value.map(({ id }) => id!))
        if (missingIds.length !== 0 /*|| redundantIds.length !== 0*/) {
            let newLayout = [...storedNormalLayout.value]
            missingIds.forEach(id => {
                newLayout.push({
                    x: (newLayout.length * 2) % 12, // extracted from documentation
                    y: newLayout.length + 12, // it will always be added at the bottom
                    w: 2,
                    h: 4,
                    i: id
                })
            })
            // layout got changed so update it in the store
            calculator.updateNSL(newLayout, props.categoryId)
        }
    }
}
const handleLayoutUpdateEvent = function (newLayout: Layout) {
    // this is supposed to only run after the grid-layout component triggers an update due to movement
    // this routine should not be called if the layout-items got changed (added or removed)
    // this routine adds the elements back to the layout, that got filtered out from the stored one
    // due o the subscriptions, not all stored elements should be displayed, but they should not be removed from the stored one
    // even if they are not to be displayed due to different subscriptions
    if (props.useQuickMode) {
        if (redundantQuickElements.value.length !== 0) {
            calculator.updateQSL([...newLayout, ...redundantQuickElements.value], props.categoryId)
        } else {
            calculator.updateQSL(newLayout, props.categoryId)
        }
    } else {
        if (redundantNormalElements.value.length !== 0) {
            calculator.updateNSL([...newLayout, ...redundantNormalElements.value], props.categoryId)
        } else {
            calculator.updateNSL(newLayout, props.categoryId)
        }
    }
}
const getLayoutDiff = function (layout: Layout, ids: Array<number | string>) {
    let missingIds = ids.filter(id => !layout.map(({ i }) => i).includes(id))
    let redundantIds = layout.map(({ i }) => i).filter(i => !ids.includes(i))
    return { missingIds, redundantIds }
}


onMounted(() => {
    setupLayout()
})
watch(() => items.value, () => {
    setupLayout()
}, { immediate: true, deep: true })
watch(() => baseItems.value, () => {
    setupLayout()
}, { immediate: true, deep: true })
watch(() => storedNormalLayout.value, () => {
    setupLayout()
}, { immediate: true, deep: true })
watch(() => storedQuickLayout.value, () => {
    setupLayout()
}, { immediate: true, deep: true })
watch(() => usersettings.subscriptions, () => {
    setupLayout()
}, { immediate: true, deep: true })
</script>

<style>
div.v-skeleton-loader__bone.v-skeleton-loader__image {
    height: 100%;
    border-radius: 4px;
}
</style>