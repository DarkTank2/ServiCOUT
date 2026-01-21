<template>
    <v-card max-height="500px" style="overflow: auto;" id="scroll-container">
        <template #title>
            <span>Datenkontrolle und Import</span>
            <v-btn @click="test()" variant="outlined" class="ml-4">Import</v-btn>
            <!-- <v-btn @click="clear()">Abbrechen</v-btn>
            <v-btn @click="setupCreationData()">Reset</v-btn> -->
        </template>
        <template #text>
            <v-list density="compact">
                <v-list-subheader>Kategorien</v-list-subheader>
                <v-list-item v-for="cat in categoryData" :ref="(el) => listItems[cat.ref] = el" :tonal="cat.status === 'inCreation'">
                    <template #prepend>
                        <v-icon v-if="cat.create === false" icon="mdi-link-variant-remove"></v-icon>
                        <v-progress-circular v-else-if="cat.status === 'inCreation'" color="primary" indeterminate></v-progress-circular>
                        <v-icon v-else-if="cat.status === 'created' || cat.create === 'exists'" icon="mdi-check-circle" color="success"></v-icon>
                        <v-icon v-else-if="cat.status === 'failed'" icon="mdi-close-circle" color="error"></v-icon>
                        <v-icon v-else-if="cat.status === 'toBeCreated'" icon="mdi-check"></v-icon>
                    </template>
                    <v-list-item-title>
                        <span :class="{ 'text-decoration-line-through': cat.create === false }">{{ cat.data.name }}</span>
                    </v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-subheader>Basis-Produkte</v-list-subheader>
                <v-list-item v-for="baseItem in baseItemData" :ref="(el) => listItems[baseItem.ref] = el" :tonal="baseItem.status === 'inCreation'">
                    <template #prepend>
                        <v-icon v-if="baseItem.create === false" icon="mdi-link-variant-remove"></v-icon>
                        <v-progress-circular v-else-if="baseItem.status === 'inCreation'" color="primary" indeterminate></v-progress-circular>
                        <v-icon v-else-if="baseItem.status === 'created' || baseItem.create === 'exists'" icon="mdi-check-circle" color="success"></v-icon>
                        <v-icon v-else-if="baseItem.status === 'failed'" icon="mdi-close-circle" color="error"></v-icon>
                        <v-icon v-else-if="baseItem.status === 'toBeCreated'" icon="mdi-check"></v-icon>
                    </template>
                    <v-list-item-title>
                        <span :class="{ 'text-decoration-line-through': baseItem.create === false }">{{ baseItem.data.name }}</span>
                    </v-list-item-title>
                    <template #append>
                        <v-tooltip>
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" icon="mdi-shape" :color="baseItem.references?.at(0)?.status === 'created' || baseItem.references?.at(0)?.create === 'exists' ? 'success' : (baseItem.references?.at(0)?.status === 'failed' ? 'error' : undefined)"></v-icon>
                            </template>
                            <span v-if="baseItem.references?.at(0)?.status === 'created' || baseItem.references?.at(0)?.create === 'exists'">Zugehörige Kategorie ist angelegt</span>
                            <span v-else-if="baseItem.references?.at(0)?.status === 'failed'">Zugehörige Kategorie konnte nicht angelegt werden</span>
                            <span v-else>Zugehörige Kategorie wird noch angelegt</span>
                        </v-tooltip>
                    </template>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-subheader>Größen</v-list-subheader>
                <v-list-item v-for="size in sizeData" :ref="(el) => listItems[size.ref] = el" :tonal="size.status === 'inCreation'">
                    <template #prepend>
                        <v-icon v-if="size.create === false" icon="mdi-link-variant-remove"></v-icon>
                        <v-progress-circular v-else-if="size.status === 'inCreation'" color="primary" indeterminate></v-progress-circular>
                        <v-icon v-else-if="size.status === 'created' || size.create === 'exists'" icon="mdi-check-circle" color="success"></v-icon>
                        <v-icon v-else-if="size.status === 'failed'" icon="mdi-close-circle" color="error"></v-icon>
                        <v-icon v-else-if="size.status === 'toBeCreated'" icon="mdi-check"></v-icon>
                    </template>
                    <v-list-item-title>
                        <span :class="{ 'text-decoration-line-through': size.create === false }">{{ size.data.name }}</span>
                    </v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-subheader>Ausrichtungen</v-list-subheader>
                <v-list-item v-for="flavour in flavourData" :ref="(el) => listItems[flavour.ref] = el" :tonal="flavour.status === 'inCreation'">
                    <template #prepend>
                        <v-icon v-if="flavour.create === false" icon="mdi-link-variant-remove"></v-icon>
                        <v-progress-circular v-else-if="flavour.status === 'inCreation'" color="primary" indeterminate></v-progress-circular>
                        <v-icon v-else-if="flavour.status === 'created' || flavour.create === 'exists'" icon="mdi-check-circle" color="success"></v-icon>
                        <v-icon v-else-if="flavour.status === 'failed'" icon="mdi-close-circle" color="error"></v-icon>
                        <v-icon v-else-if="flavour.status === 'toBeCreated'" icon="mdi-check"></v-icon>
                    </template>
                    <v-list-item-title>
                        <span :class="{ 'text-decoration-line-through': flavour.create === false }">{{ flavour.data.name }}</span>
                    </v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-subheader>Produkte</v-list-subheader>
                <v-list-item v-for="item in itemData" :ref="(el) => listItems[item.ref] = el" :tonal="item.status === 'inCreation'">
                    <template #prepend>
                        <v-icon v-if="item.create === false" icon="mdi-link-variant-remove"></v-icon>
                        <v-progress-circular v-else-if="item.status === 'inCreation'" color="primary" indeterminate></v-progress-circular>
                        <v-icon v-else-if="item.status === 'created' || item.create === 'exists'" icon="mdi-check-circle" color="success"></v-icon>
                        <v-icon v-else-if="item.status === 'failed'" icon="mdi-close-circle" color="error"></v-icon>
                        <v-icon v-else-if="item.status === 'toBeCreated'" icon="mdi-check"></v-icon>
                    </template>
                    <v-list-item-title>
                        <span :class="{ 'text-decoration-line-through': item.create === false }">{{ [item.data.sizeName, item.data.baseItemName, item.data.flavourName].join(' ') }} @ {{ item.data.price }}€</span>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <span :class="{ 'text-decoration-line-through': item.create === false }">{{ item.data.categoryName }}</span>
                    </v-list-item-subtitle>
                    <template #append>
                        <v-tooltip>
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" icon="mdi-shape" :color="item.references?.at(0)?.status === 'created' || item.references?.at(0)?.create === 'exists' ? 'success' : (item.references?.at(0)?.status === 'failed' ? 'error' : undefined)"></v-icon>
                            </template>
                            <span v-if="item.references?.at(0)?.status === 'created' || item.references?.at(0)?.create === 'exists'">Zugehörige Kategorie ist angelegt</span>
                            <span v-else-if="item.references?.at(0)?.status === 'failed'">Zugehörige Kategorie konnte nicht angelegt werden</span>
                            <span v-else>Zugehörige Kategorie wird noch angelegt</span>
                        </v-tooltip>
                        <v-tooltip>
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" icon="mdi-food" :color="item.references?.at(1)?.status === 'created' || item.references?.at(1)?.create === 'exists' ? 'success' : (item.references?.at(1)?.status === 'failed' ? 'error' : undefined)"></v-icon>
                            </template>
                            <span v-if="item.references?.at(1)?.status === 'created' || item.references?.at(1)?.create === 'exists'">Zugehöriges Basis-Produkt ist angelegt</span>
                            <span v-else-if="item.references?.at(1)?.status === 'failed'">Zugehöriges Basis-Produkt konnte nicht angelegt werden</span>
                            <span v-else>Zugehöriges Basis-Produkt wird noch angelegt</span>
                        </v-tooltip>
                        <v-tooltip>
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" icon="mdi-arrow-up-down" :color="item.references?.at(2)?.status === 'created' || item.references?.at(2)?.create === 'exists' ? 'success' : (item.references?.at(2)?.status === 'failed' ? 'error' : undefined)"></v-icon>
                            </template>
                            <span v-if="item.references?.at(2)?.status === 'created' || item.references?.at(2)?.create === 'exists'">Zugehörige Größe ist angelegt</span>
                            <span v-else-if="item.references?.at(2)?.status === 'failed'">Zugehörige Größe konnte nicht angelegt werden</span>
                            <span v-else>Zugehörige Größe wird noch angelegt</span>
                        </v-tooltip>
                        <v-tooltip>
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" icon="mdi-square-circle" :color="item.references?.at(3)?.status === 'created' || item.references?.at(3)?.create === 'exists' ? 'success' : (item.references?.at(3)?.status === 'failed' ? 'error' : undefined)"></v-icon>
                            </template>
                            <span v-if="item.references?.at(3)?.status === 'created' || item.references?.at(3)?.create === 'exists'">Zugehörige Ausrichtung ist angelegt</span>
                            <span v-else-if="item.references?.at(3)?.status === 'failed'">Zugehörige Ausrichtung konnte nicht angelegt werden</span>
                            <span v-else>Zugehörige Ausrichtung wird noch angelegt</span>
                        </v-tooltip>
                    </template>
                </v-list-item>
            </v-list>
        </template>
    </v-card>
</template>
<script setup lang="ts">
import type { BaseItemsData, CategoriesData, FlavoursData, ItemsData, SizesData } from 'backend';
import type { Header, HeaderKey } from './HeaderMapper.vue';
import { useGoTo } from 'vuetify';

const { api } = useFeathers()
const auth = useAuthStore()
const goto = useGoTo()

const { data: allCategories } = toRefs(api.service('categories').findInStore(computed(() => ({ query: {} }))))
const { data: allBaseItems } = toRefs(api.service('base-items').findInStore(computed(() => ({ query: {} }))))
const { data: allSizes } = toRefs(api.service('sizes').findInStore(computed(() => ({ query: {} }))))
const { data: allFlavours } = toRefs(api.service('flavours').findInStore(computed(() => ({ query: {} }))))
const { data: allItems } = toRefs(api.service('items').findInStore(computed(() => ({ query: {} }))))
const assembledItems = computed(() => {
    return allItems.value.map(item => {
        let baseItem = api.service('base-items').getFromStore(item.baseItemId!).value
        let category = api.service('categories').getFromStore(baseItem.categoryId!).value
        let size = api.service('sizes').getFromStore(item.sizeId!).value
        let flavour = api.service('flavours').getFromStore(item.flavourId!).value
        return {
            categoryName: category.name,
            baseItemName: baseItem.name,
            sizeName: size.name,
            flavourName: flavour.name,
            price: item.price,
            comment: baseItem.description
        }

    })
})

type Matrix<T> = Array<Array<T>>
interface ImportHelperProps {
    header: Array<Header>,
    data: Matrix<string>
}
const props = defineProps<ImportHelperProps>()

type Status = 'toBeCreated' | 'inCreation' | 'created' | 'failed'
type CreationData<T> = {
    data: T,
    create: boolean | 'exists', // create indicates if the data should be created in the backend (true) or if it already exists with exact same properties and values ('exists') or if a dependency is not created and the data itself cannot be created (false)
    status: Status, // this property indicates the status of the data/object itself
    ref: string,
    references?: Array<{ status: Status, create: boolean | 'exists' }>
}
type ValueTransformatorBase = {
    [K in HeaderKey]: (value: string) => string
}
interface ValueTransformator extends Omit<ValueTransformatorBase, 'price'> {
    'price': (value: string) => number
}
interface MBaseItemsData extends Omit<BaseItemsData, 'categoryId'> {
    categoryName: string
}
interface MItemsData extends Omit<ItemsData, 'baseItemId' | 'sizeId' | 'flavourId'> {
    baseItemName: string,
    sizeName: string,
    flavourName: string,
    categoryName: string
}

const valueTransformer = ref<ValueTransformator>({
    'category': (v: string) => v,
    'base-item': (v: string) => v,
    flavour: (v: string) => v,
    size: (v: string) => v,
    price: (v: string) => {
        if (Number.isNaN(Number.parseFloat(v.replace(',', '.')))) {
            return -1
        }
        return Number.parseFloat(v.replace(',', '.'))
    },
    comment: (v: string) => v
})
const categoryData = ref<Array<CreationData<CategoriesData>>>([])
const baseItemData = ref<Array<CreationData<MBaseItemsData>>>([])
const sizeData = ref<Array<CreationData<SizesData>>>([])
const flavourData = ref<Array<CreationData<FlavoursData>>>([])
const itemData = ref<Array<CreationData<MItemsData>>>([])
const state = ref<['category' | 'base-item' | 'size' | 'flavour' | 'item', number]>(['category', 0])
const timer = ref<NodeJS.Timeout>()

const listItems = ref<{ [key: string]: any }>({})

const tenant = computed(() => {
    let tenantId = auth.user?.tenantId
    if (!tenantId) {
        return api.service('tenants').findInStore().data[0]
    }
    return api.service('tenants').getFromStore(tenantId).value

})

const setupCreationData = function () {
    categoryData.value = []
    baseItemData.value = []
    sizeData.value = []
    flavourData.value = []
    itemData.value = []

    const c = props.header.findIndex(({ key }) => key === 'category')
    const bi = props.header.findIndex(({ key }) => key === 'base-item')
    const s = props.header.findIndex(({ key }) => key === 'size')
    const f = props.header.findIndex(({ key }) => key === 'flavour')
    const p = props.header.findIndex(({ key }) => key === 'price')
    const com = props.header.findIndex(({ key }) => key === 'comment')
    props.data.forEach((line, l) => {
        let category = line[c]!
        let baseItem = line[bi]!
        let size = line[s]!
        let flavour = line[f]!
        let price = line[p]!
        let comment = line[com]!

        let persistedCategory = api.service('categories').findInStore({ query: { name: category } }).data[0]
        let persistedSize = api.service('sizes').findInStore({ query: { name: size } }).data[0]
        let persistedFlavour = api.service('flavours').findInStore({ query: { name: flavour } }).data[0]
        let persistedBaseItem = api.service('base-items').findInStore({ query: { name: baseItem } }).data[0]
        let persistedItem = assembledItems.value.find(item => {
            return item.categoryName === category
                && item.baseItemName === baseItem
                && item.sizeName === size
                && item.flavourName === flavour
                && item.price === valueTransformer.value.price(price)
        })

        let categoryRef = `category:${category}`
        let baseItemRef = `base-item:${baseItem}`
        let sizeRef = `size:${size}`
        let flavourRef = `flavour:${flavour}`

        let setupCategory = categoryData.value.find(({ ref }) => ref === categoryRef)
        let setupBaseItem = baseItemData.value.find(({ ref }) => ref === baseItemRef)
        let setupSize = sizeData.value.find(({ ref }) => ref === sizeRef)
        let setupFlavour = flavourData.value.find(({ ref }) => ref === flavourRef)

        let cat: CreationData<CategoriesData> = { ref: categoryRef, data: { name: category, active: true, tenantId: tenant.value?.id || 1, shippedToUsers: true }, create: persistedCategory ? 'exists' : true, status: 'toBeCreated' }
        let bsi: CreationData<MBaseItemsData> = { ref: baseItemRef, data: { name: baseItem, description: comment, categoryName: category, tenantId: tenant.value?.id || 1 }, create: persistedBaseItem ? 'exists' : true, status: 'toBeCreated', references: [setupCategory || cat] }
        let sz: CreationData<SizesData> = { ref: sizeRef, data: { name: size }, create: persistedSize ? 'exists' : true, status: 'toBeCreated' }
        let fl: CreationData<FlavoursData> = { ref: flavourRef, data: { name: flavour }, create: persistedFlavour ? 'exists' : true, status: 'toBeCreated' }
        
        if (!categoryData.value.some(({ data }) => data.name === category)) {
            categoryData.value.push(cat)
        }
        if (!sizeData.value.some(({ data }) => data.name === size)) {
            sizeData.value.push(sz)
        }
        if (!flavourData.value.some(({ data }) => data.name === flavour)) {
            flavourData.value.push(fl)
        }
        if (!baseItemData.value.some(({ data }) => data.name === baseItem)) {
            baseItemData.value.push(bsi)
        }
        if (!itemData.value.some(({ data }) => {
                return data.baseItemName === baseItem
                && data.sizeName === size
                && data.flavourName === flavour
                && data.price === valueTransformer.value.price(price)
        })) {
            itemData.value.push({
                ref: `item:${[category, baseItem, size, flavour].join('|')}`,
                data: {
                    categoryName: category,
                    baseItemName: baseItem,
                    sizeName: size,
                    flavourName: flavour,
                    price: valueTransformer.value.price(price),
                    default: false
                },
                create: persistedItem ? 'exists' : true,
                status: 'toBeCreated',
                references: [setupCategory || cat, setupBaseItem || bsi, setupSize || sz, setupFlavour || fl]
            })
        }
    })
}
const test = function () {
    state.value = ['category', 0]
    cb()
}
const cb = async function () {
    let curIndex = state.value[1]
    let ref = '' 
    if (state.value[0] === 'category') {
        ref = `${state.value[0]}:${categoryData.value[curIndex]?.data.name}`
        if (categoryData.value[curIndex]?.create === true) {
            categoryData.value[curIndex]!.status = 'inCreation'
            let res = await api.service('categories').create(categoryData.value[curIndex]!.data).catch(err => false)
            // let res = Math.random() > 0.1
            if (res === false) {
                categoryData.value[curIndex]!.status = 'failed'
                baseItemData.value.filter(bi => bi.data.categoryName === categoryData.value[curIndex]!.data.name).forEach(bi => {
                    bi.create = false
                })
                itemData.value.filter(i => i.data.categoryName === categoryData.value[curIndex]!.data.name).forEach(i => {
                    i.create = false
                })
            } else {
                categoryData.value[curIndex]!.status = 'created'
            }
        }
        curIndex++
        if (curIndex >= categoryData.value.length) {
            state.value = ['base-item', 0]
        } else {
            state.value = ['category', curIndex]
        }
    } else if (state.value[0] === 'base-item') {
        let data = baseItemData.value[curIndex]?.data
        ref = `${state.value[0]}:${baseItemData.value[curIndex]?.data.name}`
        if (baseItemData.value[curIndex]?.create === true) {
            let category = api.service('categories').findInStore({ query: { name: data?.categoryName } }).data[0]
            if (!category) {
                baseItemData.value[curIndex]!.status = 'failed'
                itemData.value.filter(i => i.data.baseItemName === baseItemData.value[curIndex]!.data.name).forEach(i => {
                    i.create = false
                })
            } else {
                baseItemData.value[curIndex]!.status = 'inCreation'
                let res = await api.service('base-items').create({ 
                    categoryId: category?.id!,
                    name: data?.name!,
                    description: data?.description,
                    tenantId: data?.tenantId!,
                    available: true
                }).catch(err => false)
                // let res = Math.random() > 0.1
                if (res === false) {
                    baseItemData.value[curIndex]!.status = 'failed'
                    itemData.value.filter(i => i.data.baseItemName === baseItemData.value[curIndex]!.data.name).forEach(i => {
                        i.create = false
                    })
                } else {
                    baseItemData.value[curIndex]!.status = 'created'
                }
            }
        }
        curIndex++
        if (curIndex >= baseItemData.value.length) {
            state.value = ['size', 0]
        } else {
            state.value = ['base-item', curIndex]
        }
    } else if (state.value[0] === 'size') {
        ref = `${state.value[0]}:${sizeData.value[curIndex]?.data.name}`
        if (sizeData.value[curIndex]?.create === true) {
            sizeData.value[curIndex]!.status = 'inCreation'
            let res = await api.service('sizes').create(sizeData.value[curIndex]!.data).catch(err => false)
            // let res = Math.random() > 0.1
            if (res === false) {
                sizeData.value[curIndex]!.status = 'failed'
                itemData.value.filter(i => i.data.sizeName === sizeData.value[curIndex]!.data.name).forEach(i => {
                    i.create = false
                })
            } else {
                sizeData.value[curIndex]!.status = 'created'
            }
        }
        curIndex++
        if (curIndex >= sizeData.value.length) {
            state.value = ['flavour', 0]
        } else {
            state.value = ['size', curIndex]
        }
    } else if (state.value[0] === 'flavour') {
        ref = `${state.value[0]}:${flavourData.value[curIndex]?.data.name}`
        if (flavourData.value[curIndex]?.create === true) {
            flavourData.value[curIndex]!.status = 'inCreation'
            let res = await api.service('flavours').create(flavourData.value[curIndex]!.data).catch(err => false)
            // let res = Math.random() > 0.1
            if (res === false) {
                flavourData.value[curIndex]!.status = 'failed'
                itemData.value.filter(i => i.data.flavourName === flavourData.value[curIndex]!.data.name).forEach(i => {
                    i.create = false
                })
            } else {
                flavourData.value[curIndex]!.status = 'created'
            }
        }
        curIndex++
        if (curIndex >= flavourData.value.length) {
            state.value = ['item', 0]
        } else {
            state.value = ['flavour', curIndex]
        }
    } else if (state.value[0] === 'item') {
        let data = itemData.value[curIndex]!.data
        ref = `${state.value[0]}:${[data.categoryName, data.baseItemName, data.sizeName, data.flavourName].join('|')}`
        if (itemData.value[curIndex]?.create === true) {
            let baseItem = api.service('base-items').findInStore({ query: { name: data.baseItemName } }).data[0]
            let size = api.service('sizes').findInStore({ query: { name: data.sizeName } }).data[0]
            let flavour = api.service('flavours').findInStore({ query: { name: data.flavourName } }).data[0]
            if (!baseItem || !size || !flavour) {
                itemData.value[curIndex]!.status = 'failed'
            } else {
                itemData.value[curIndex]!.status = 'inCreation'
                let res = await api.service('items').create({ 
                    baseItemId: baseItem.id!,
                    sizeId: size.id!,
                    flavourId: flavour.id!,
                    price: data.price,
                    default: false
                }).catch(err => false)
                // let res = Math.random() >= 0
                if (res === false) {
                    itemData.value[curIndex]!.status = 'failed'
                } else {
                    itemData.value[curIndex]!.status = 'created'
                }
            }
        }
        curIndex++
        if (curIndex >= itemData.value.length) {
            state.value = ['category', 0]
            return
        } else {
            state.value = ['item', curIndex]
        }
    }
    // if (listItems.value[ref]) {
    //     goto(listItems.value[ref], {
    //         offset: 40 - 500,
    //         container: '#scroll-container',
    //         easing: 'easeInOutCubic'
    //     })
    // }

    timer.value = setTimeout(cb, 0)
}
const clear = function () {
    if (timer.value) {
        clearTimeout(timer.value)
    }
}

watch(() => props.data, () => {
    // build creation-information anew
    setupCreationData()
}, { deep: true, immediate: true })
</script>