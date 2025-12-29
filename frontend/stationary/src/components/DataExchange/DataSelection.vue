<template>
    <v-expansion-panels v-model="expModel">
        <v-expansion-panel :title="'Filter'">
            <template #text>
                <v-row>
                    <v-col cols="4">
                        <v-select
                            v-model="categoryModel"
                            :items="categories.data.value"
                            item-title="name"
                            item-value="id"
                            multiple
                            density="compact"
                            variant="outlined"
                            label="Kategorien"
                            >
                            <template v-slot:selection="{ item, index }">
                                <v-chip v-if="index < 2" label>
                                    <template #prepend>
                                        <v-icon v-if="selectedCategories.includes(item.raw.id!)" icon="mdi-checkbox-marked-outline"></v-icon>
                                        <v-icon v-else-if="intermediateCategories.includes(item.raw.id!)" icon="mdi-minus-box-outline"></v-icon>
                                    </template>
                                    <span :style="{ color: item.raw.color }">{{ item.title }}</span>
                                </v-chip>
                                <span v-if="index === 2" class="text-grey text-caption align-self-center" >
                                    (+{{ categoryModel.length - 2 }})
                                </span>
                            </template>
                            <template #item="{ item, props }">
                                <v-list-item @click="toggleCategory(item.value)">
                                    <template #prepend>
                                        <v-icon v-if="selectedCategories.includes(item.raw.id!)" icon="mdi-checkbox-marked-outline"></v-icon>
                                        <v-icon v-else-if="intermediateCategories.includes(item.raw.id!)" icon="mdi-minus-box-outline"></v-icon>
                                        <v-icon v-else icon="mdi-checkbox-blank-outline"></v-icon>
                                    </template>
                                    <v-list-item-title :style="{ color: item.raw.color }">{{ item.raw.name }}</v-list-item-title>
                                </v-list-item>
                            </template>
                        </v-select>
                    </v-col>
                    <v-col cols="4">
                        <v-select
                            v-model="baseItemModel"
                            :items="populatedBaseItems"
                            item-title="name"
                            item-value="id"
                            multiple
                            density="compact"
                            variant="outlined"
                            label="Produkte"
                            >
                            <template v-slot:selection="{ item, index }">
                                <v-chip v-if="index < 2" label>
                                    <template #prepend>
                                        <v-icon v-if="selectedBaseItems.includes(item.raw.id!)" icon="mdi-checkbox-marked-outline"></v-icon>
                                        <v-icon v-else-if="intermediateBaseItems.includes(item.raw.id!)" icon="mdi-minus-box-outline"></v-icon>
                                    </template>
                                    <span :style="{ color: item.raw.category.color }">{{ item.title }}</span>
                                </v-chip>
                                <span v-if="index === 2" class="text-grey text-caption align-self-center" >
                                    (+{{ baseItemModel.length - 2 }})
                                </span>
                            </template>
                            <template #item="{ item, props }">
                                <v-list-item @click="toggleBaseItem(item.value)">
                                    <template #prepend>
                                        <v-icon v-if="selectedBaseItems.includes(item.raw.id!)" icon="mdi-checkbox-marked-outline"></v-icon>
                                        <v-icon v-else-if="intermediateBaseItems.includes(item.raw.id!)" icon="mdi-minus-box-outline"></v-icon>
                                        <v-icon v-else icon="mdi-checkbox-blank-outline"></v-icon>
                                    </template>
                                    <v-list-item-title :style="{ color: item.raw.category.color }">{{ item.raw.name }}</v-list-item-title>
                                </v-list-item>
                            </template>
                        </v-select>
                    </v-col>
                    <v-col cols="2"><v-btn block @click="model = items.data.value.map(({ id }) => id!)"><v-icon icon="mdi-checkbox-multiple-marked-outline"></v-icon>Alles</v-btn></v-col>
                    <v-col cols="2"><v-btn block @click="model = []"><v-icon icon="mdi-close-box-multiple-outline"></v-icon>Nichts</v-btn></v-col>
                </v-row>
            </template>
        </v-expansion-panel>
    </v-expansion-panels>
    <v-list>
        <v-list-item v-for="{ item, baseItem, subtitle, category } in populatedItems" :title="baseItem.name" class="border rounded ma-1" @click="toggleItem(item.id!)">
            <template #prepend>
                <v-icon :icon="model.includes(item.id!) ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline'"></v-icon>
            </template>
            <v-list-item-subtitle>
                {{ subtitle }}
            </v-list-item-subtitle>
            <template #append>
                <v-chip label>
                    <span :style="{ color: category.color }">{{ category.name }}</span>
                </v-chip>
            </template>
        </v-list-item>
    </v-list>
</template>
<script setup lang="ts" generic="T extends any">
const { api } = useFeathers()

// const props = defineProps<{ data: Array<T> }>()
const model = defineModel<Array<number>>({ required: true })

const expModel = ref([0])

const categoryModel = ref<Array<number>>([])
const baseItemModel = ref<Array<number>>([])
const selectedCategories = ref<Array<number>>([])
const intermediateCategories = ref<Array<number>>([])
const selectedBaseItems = ref<Array<number>>([])
const intermediateBaseItems = ref<Array<number>>([])

const categories = toRefs(api.service('categories').findInStore(computed(() => ({}))))
const baseItems = toRefs(api.service('base-items').findInStore(computed(() => ({ query: { $sort: { categoryId: 1 } } }))))
const items = toRefs(api.service('items').findInStore(computed(() => ({}))))
const populatedItems = computed(() => {
    return items.data.value.map(item => {
        let baseItem = api.service('base-items').getFromStore(item.baseItemId!).value
        let category = api.service('categories').getFromStore(baseItem.categoryId!).value
        let size = api.service('sizes').getFromStore(item.sizeId!).value
        let flavour = api.service('flavours').getFromStore(item.flavourId!).value
        let subtitle = ''
        if (!['', ' ', '-'].includes(size.name!)) {
            subtitle += size.name!
            subtitle += ' '
        }
        subtitle += baseItem.name!
        if (!['', ' ', '-'].includes(flavour.name!)) {
            subtitle += ' '
            subtitle += flavour.name!
        }
        return {
            item,
            baseItem,
            category,
            subtitle
        }
    })
})
const populatedBaseItems = computed(() => {
    return baseItems.data.value.map(baseItem => {
        let category = api.service('categories').getFromStore(baseItem.categoryId!).value
        return {
            ...baseItem,
            category
        }
    })
})

const pushToRefIfNotIncluded = function<T, U extends Ref<Array<T>>> (arrRef: U, value: T) {
    if (!arrRef.value.includes(value)) {
        arrRef.value.push(value)
    }
}
const pushAllIfNotIncluded = function<T, U extends Ref<Array<T>>> (arrRef: U, values: Array<T>) {
    arrRef.value.push(...values.filter(v => !arrRef.value.includes(v)))
}
const removeFromRefIfIncluded = function<T, U extends Ref<Array<T>>> (arrRef: U, value: T) {
    if (arrRef.value.includes(value)) {
        arrRef.value = arrRef.value.filter(v => v !== value)
    }
}
const removeAllFromRefIfIncluded = function<T, U extends Ref<Array<T>>> (arrRef: U, values: Array<T>) {
    arrRef.value = arrRef.value.filter(v => !values.includes(v))
}
const sanitizeSelectionTree = function () {
    categoryModel.value = []
    baseItemModel.value = []
    selectedCategories.value = []
    intermediateCategories.value = []
    selectedBaseItems.value = []
    intermediateBaseItems.value = []

    let allCategories = api.service('categories').findInStore({}).data
    for (let { id: categoryId } of allCategories) {
        let allBaseItems = api.service('base-items').findInStore({ query: { categoryId: categoryId } }).data
        for (let { id: baseItemId } of allBaseItems) {
            let allItems = api.service('items').findInStore({ query: { baseItemId: baseItemId } }).data
            if (allItems.map(({ id }) => id!).every(id => model.value.includes(id))) {
                pushToRefIfNotIncluded(baseItemModel, baseItemId!)
                pushToRefIfNotIncluded(selectedBaseItems, baseItemId!)
                removeFromRefIfIncluded(intermediateBaseItems, baseItemId!)
            } else if (allItems.map(({ id }) => id!).some(id => model.value.includes(id))) {
                pushToRefIfNotIncluded(baseItemModel, baseItemId!)
                pushToRefIfNotIncluded(intermediateBaseItems, baseItemId!)
                removeFromRefIfIncluded(selectedBaseItems, baseItemId!)
            }
        }
        if (allBaseItems.map(({ id }) => id!).every(id => selectedBaseItems.value.includes(id))) {
            pushToRefIfNotIncluded(categoryModel, categoryId!)
            pushToRefIfNotIncluded(selectedCategories, categoryId!)
            removeFromRefIfIncluded(intermediateCategories, categoryId!)
        } else if (allBaseItems.map(({ id }) => id!).some(id => selectedBaseItems.value.includes(id)) ||
                    allBaseItems.map(({ id }) => id!).some(id => intermediateBaseItems.value.includes(id))) {
            pushToRefIfNotIncluded(categoryModel, categoryId!)
            pushToRefIfNotIncluded(intermediateCategories, categoryId!)
            removeFromRefIfIncluded(selectedCategories, categoryId!)
        }
    }
}
const toggleItem = function (itemId: number) {
    if (model.value.includes(itemId)) {
        model.value = model.value.filter(id => id !== itemId)
    } else {
        model.value.push(itemId)
    }
}

const toggleCategory = function (categoryId: number) {
    let baseItems = api.service('base-items').findInStore({ query: { categoryId } }).data.map(({ id }) => id!)
    let items = api.service('items').findInStore({ query: { baseItemId: { $in: baseItems } } }).data.map(({ id }) => id!)
    if (categoryModel.value.includes(categoryId)) {
        // every base item must be removed from model
        removeAllFromRefIfIncluded(model, items)
    } else {
        pushAllIfNotIncluded(model, items)
    }
}

const toggleBaseItem = function (baseItemId: number) {
    let items = api.service('items').findInStore({ query: { baseItemId } }).data.map(({ id }) => id!)
    if (baseItemModel.value.includes(baseItemId)) {
        // every base item must be removed from model
        removeAllFromRefIfIncluded(model, items)
    } else {
        pushAllIfNotIncluded(model, items)
    }
}

watch(model, () => {
    sanitizeSelectionTree()
}, { deep: true, immediate: true })
</script>