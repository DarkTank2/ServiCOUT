<template>
    <div v-if="calculator.quickMode">
        <SingleCategory v-for="category of displayedCategories" :category-id="category.id!" :use-quick-mode="true" />
    </div>
    <div v-else>
        <SingleCategory v-for="category of displayedCategories" :category-id="category.id!" :use-quick-mode="false" />
    </div>
</template>
<script setup lang="ts">
// the layout and stuff is handled this ways because of interferences with changing layouts and modes
// therefore it is advised to render each category individually ad only change between the layouts by rendering different components
// this way the layouts of the different moi won't mess up as the watchers won't trigger wrong updates
import SingleCategory from './SingleCategory.vue';

const usersettings = useUsersettings()
const calculator = useCalculatorStore()
const { api } = useFeathers()

const { data: subscribedBaseItems } = toRefs(api.service('base-items').findInStore(computed(() => ({ query: { id: { $in: usersettings.subscriptions } } }))))
const { data: displayedCategories } = toRefs(api.service('categories').findInStore(computed(() => ({ query: { id: { $in: subscribedBaseItems.value.map(({ categoryId }) => categoryId!) } } }))))

</script>