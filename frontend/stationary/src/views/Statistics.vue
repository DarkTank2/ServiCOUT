<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-expansion-panels v-model="expansionPanelModel">
                    <v-expansion-panel>
                        <v-expansion-panel-title>
                            <template v-slot:default="{ expanded }">
                                <v-row no-gutters>
                                    <v-col class="d-flex justify-start" cols="4">
                                        Einstellungen
                                    </v-col>
                                    <v-col class="text-grey" cols="8">
                                        <v-fade-transition leave-absolute>
                                            <span v-if="expanded" key="0">
                                                {{ selectedUsername ? `Einstellungen für Nutzer "${selectedUsername}"` :
                    'Wähle zuerst einen Nutzer aus!' }}
                                            </span>
                                            <span v-else key="1">
                                                {{ selectedUsername ? `${selectedUsername} von ${fullStartTimestamp} bis ${fullEndTimestamp}` : '...' }}
                                            </span>
                                        </v-fade-transition>
                                    </v-col>
                                </v-row>
                            </template>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-row>
                                <v-col cols="3">
                                    <v-select label="Stationsname" v-model="selectedUsername" :items="allUsernames"
                                        variant="outlined" hide-details
                                        @update:model-value="updateSelection('username')">
                                        <template #selection="{ item }">
                                            <v-chip>
                                                <span>{{ item.title }}</span>
                                            </v-chip>
                                        </template>
                                    </v-select>
                                </v-col>
                                <v-col cols="3">
                                    <v-select label="Kategorien" v-model="selectedCategories" multiple
                                        :items="allCategories" variant="outlined" hide-details item-value="id"
                                        item-title="name" @update:model-value="updateSelection('categories')">
                                        <template v-slot:selection="{ item, index }">
                                            <v-chip v-if="index < 1">
                                                <span>{{ item.title }}</span>
                                            </v-chip>
                                            <span v-if="index === 1" class="text-grey text-caption align-self-center">
                                                (+{{ selectedCategories.length - 1 }} weitere)
                                            </span>
                                        </template>
                                    </v-select>
                                </v-col>
                                <v-col cols="3">
                                    <v-select label="Basis-Produkte" v-model="selectedBaseItems" multiple
                                        :items="allBaseItems" variant="outlined" hide-details item-value="id"
                                        item-title="name" @update:model-value="updateSelection('base-items')">
                                        <template v-slot:selection="{ item, index }">
                                            <v-chip v-if="index < 1">
                                                <span>{{ item.title }}</span>
                                            </v-chip>
                                            <span v-if="index === 1" class="text-grey text-caption align-self-center">
                                                (+{{ selectedBaseItems.length - 1 }} weitere)
                                            </span>
                                        </template></v-select>
                                </v-col>
                                <v-col cols="3">
                                    <v-select label="Produkte" v-model="selectedItems" multiple :items="allFullItems"
                                        variant="outlined" hide-details item-value="id" item-title="name"
                                        @update:model-value="updateSelection('items')">
                                        <template v-slot:selection="{ item, index }">
                                            <v-chip v-if="index < 1">
                                                <span>{{ item.title }}</span>
                                            </v-chip>
                                            <span v-if="index === 1" class="text-grey text-caption align-self-center">
                                                (+{{ selectedItems.length - 1 }} weitere)
                                            </span>
                                        </template></v-select>
                                </v-col>
                                <v-col cols="3">
                                    <date-picker v-model="startDate" label="Start-Datum" icon="mdi-calendar-start"
                                        :max-date="endDate" @update:model-value="timeframeManuallyFixed = true" />
                                </v-col>
                                <v-col cols="3">
                                    <time-picker v-model="startTime" label="Start-Zeit" icon="mdi-clock-start"
                                        :max-time="startTimeUpperLimit"
                                        @update:model-value="timeframeManuallyFixed = true" />
                                </v-col>
                                <v-col cols="3">
                                    <date-picker v-model="endDate" label="End-Datum" icon="mdi-calendar-end"
                                        :min-date="startDate" @update:model-value="timeframeManuallyFixed = true" />
                                </v-col>
                                <v-col cols="3">
                                    <time-picker v-model="endTime" label="End-Zeit" icon="mdi-clock-end"
                                        :min-time="endTimeLowerLimit"
                                        @update:model-value="timeframeManuallyFixed = true" />
                                </v-col>
                                <v-col cols="3">
                                    <v-checkbox v-model="timeframeManuallyFixed" label="Nur manuelle Zeitrahmenanpassung zulassen"></v-checkbox>
                                </v-col>
                                <v-col cols="3">
                                    <v-select label="Zeitscheibenbreite" v-model="timeframeFormat" :items="timeframeSelectionItems"
                                        variant="outlined" hide-details item-title="name" item-value="value">
                                        <template #selection="{ item }">
                                            <v-chip>
                                                <span>{{ item.title }}</span>
                                            </v-chip>
                                        </template>
                                    </v-select>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <Line :data="dataset" :options="options" />
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import DatePicker from '@/components/Utilities/DatePicker.vue'
import TimePicker from '@/components/Utilities/TimePicker.vue'
import moment from 'moment';
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, ChartData, PointElement } from 'chart.js'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const { api } = useFeathers()
const fetchAPI = useFetchUtility()
const usersettings = useUsersettings()
const utilities = useUtilityStore()

fetchAPI.fetchAllTenants({ id: 2 })

const expansionPanelModel = ref(false)
const selectedUsername = ref<string>()
const selectedCategories = ref<Array<number>>([])
const selectedBaseItems = ref<Array<number>>([])
const selectedItems = ref<Array<number>>([])
const startDate = ref<Date | null>(null)
const startTime = ref<string>()
const endDate = ref<Date | null>(null)
const endTime = ref<string>()
const timeframeManuallyFixed = ref<boolean>(false)
const timeframeFormat = ref<'hour' | 'day' | 'month'>('hour')
const timeframeSelectionItems = ref<Array<{ name: string, value: 'hour' | 'day' | 'month' }>>([
    {
        name: 'Stunden',
        value: 'hour'
    },
    {
        name: 'Tage',
        value: 'day'
    },
    {
        name: 'Monate',
        value: 'month'
    }
])
const innerHeight = window.innerHeight - 64

const startTimeUpperLimit = computed(() => {
    // only restrict time if the dates are the same and not null
    if (startDate.value && endDate.value && startDate.value.toDateString() === endDate.value.toDateString()) {
        return endTime.value
    }
    return undefined
})
const endTimeLowerLimit = computed(() => {
    // only restrict time if the dates are the same and not null
    if (startDate.value && endDate.value && startDate.value.toDateString() === endDate.value.toDateString()) {
        return startTime.value
    }
    return undefined
})

// section where the basic orders and ordered-items are computed
const countedOrderedItems = api.service('ordered-items').countInStore(computed(() => ({ query: { notCashed: 0 } })))
const { data: allOrderedItems } = toRefs(api.service('ordered-items').findInStore(computed(() => ({ query: { notCashed: 0 }, $limit: countedOrderedItems.value }))))

const countedOrders = api.service('orders').countInStore(computed(() => ({ query: { id: { $in: allOrderedItems.value.map(({ orderId }) => orderId!) } } })))
const { data: allOrders } = toRefs(api.service('orders').findInStore(computed(() => ({ query: { id: { $in: allOrderedItems.value.map(({ orderId }) => orderId!) } }, $limit: countedOrders.value }))))

// section where all orders and ordered items are computed by name
const countedOrdersByName = api.service('orders').countInStore(computed(() => ({ query: { waiter: selectedUsername.value } })))
const { data: allOrdersByName } = toRefs(api.service('orders').findInStore(computed(() => ({ query: { waiter: selectedUsername.value }, $limit: countedOrdersByName.value }))))

const countedOrderedItemsByName = api.service('ordered-items').countInStore(computed(() => ({ query: { orderId: { $in: allOrdersByName.value.map(({ id }) => id!) } } })))
const { data: allOrderedItemsByName } = toRefs(api.service('ordered-items').findInStore(computed(() => ({ query: { orderId: { $in: allOrdersByName.value.map(({ id }) => id!) } }, $limit: countedOrderedItemsByName.value }))))

// section, where the ordered items are computed by name AND selected items
// the orders can be taken from above since "by name" is a superset of "by name and selection"
const countedOrderedItemsByNameAndSelection = api.service('ordered-items').countInStore(computed(() => ({ query: { orderId: { $in: allOrdersByName.value.map(({ id }) => id!) } } })))
const { data: allOrderedItemsByNameAndSelection } = toRefs(api.service('ordered-items').findInStore(computed(() => ({ query: { orderId: { $in: allOrdersByName.value.map(({ id }) => id!) }, itemId: { $in: selectedItems.value }, $sort: { id: 1 } }, $limit: countedOrderedItemsByNameAndSelection.value }))))

// just all misc objects
const countedItems = api.service('items').countInStore({ query: {} })
const countedSizes = api.service('sizes').countInStore({ query: {} })
const countedFlavours = api.service('flavours').countInStore({ query: {} })
const countedBaseItems = api.service('base-items').countInStore({ query: {} })
const countedCategories = api.service('categories').countInStore({ query: {} })
const { data: allItems } = toRefs(api.service('items').findInStore(computed(() => ({ query: { $limit: countedItems.value } }))))
const { data: allSizes } = toRefs(api.service('sizes').findInStore(computed(() => ({ query: { $limit: countedSizes.value } }))))
const { data: allFlavours } = toRefs(api.service('flavours').findInStore(computed(() => ({ query: { $limit: countedFlavours.value } }))))
const { data: allBaseItems } = toRefs(api.service('base-items').findInStore(computed(() => ({ query: { $limit: countedBaseItems.value } }))))
const { data: allCategories } = toRefs(api.service('categories').findInStore(computed(() => ({ query: { $limit: countedCategories.value } }))))

// assembling a name to an item
const allFullItems = computed(() => {
    return allItems.value.map(item => {
        let size = allSizes.value.find(({ id }) => id === item.sizeId)
        let flavour = allFlavours.value.find(({ id }) => id === item.flavourId)
        let baseItem = allBaseItems.value.find(({ id }) => id === item.baseItemId)
        return {
            ...item,
            name: `${size?.name} ${baseItem?.name} ${flavour?.name}`
        }
    })
})

const allUsernames = computed(() => {
    let allNames = allOrders.value.map(({ waiter }) => waiter)
    let uniqueNames = allNames.reduce((acc, val) => {
        if (!acc.includes(val!)) {
            acc.push(val!)
        }
        return acc
    }, new Array<string>())
    return uniqueNames
})
const fullStartTimestamp = computed(() => {
    if (startDate.value && startTime.value) {
        return `${moment(startDate.value).format('DD.MM.')} ${startTime.value}`
    }
    return '...'
})
const fullEndTimestamp = computed(() => {
    if (endDate.value && endTime.value) {
        return `${moment(endDate.value).format('DD.MM.')} ${endTime.value}`
    }
    return '...'
})

onMounted(async () => {
    // async fetching is done here so that the update afterwards is done whn everything is loaded and computed
    utilities.setFetchPending()
    // it is absolute necessary to sort because without the server would respond with already sent entries, this might be fixed with counting and fetching
    await fetchAPI.fetchAllOrderedItems({ notCashed: 0, $sort: { id: 1 } })
    await fetchAPI.fetchAllOrders({})
    await fetchAPI.fetchAllBaseItems({ $sort: { id: 1 } })
    await fetchAPI.fetchAllFlavours({ $sort: { id: 1 } })
    await fetchAPI.fetchAllCategories({ $sort: { id: 1 } })
    await fetchAPI.fetchAllItems({ $sort: { id: 1 } })
    await fetchAPI.fetchAllSizes({ $sort: { id: 1 } })
    utilities.resetFetchPending()
    if (usersettings.getName) {
        selectedUsername.value = usersettings.getName
        updateSelection('username')
    }
})

const updateSelection = async function (changedProperty: 'username' | 'categories' | 'base-items' | 'items') {
    if (changedProperty === 'username' || changedProperty === 'items') {
        if (changedProperty === 'username') {
            // propagate up based on ordereditems by name
            selectedItems.value = allOrderedItemsByName.value.map(({ itemId }) => itemId!).reduce((acc, val) => {
                if (!acc.includes(val)) {
                    acc.push(val)
                }
                return acc
            }, new Array<number>())
        }
        selectedBaseItems.value = selectedItems.value.map(itemId => {
            let item = allItems.value.find(({ id }) => id === itemId)
            let baseItem = allBaseItems.value.find(({ id }) => id === item?.baseItemId)
            return baseItem?.id!
        }).reduce((acc, val) => {
            if (!acc.includes(val)) {
                acc.push(val)
            }
            return acc
        }, new Array<number>())
        selectedCategories.value = selectedBaseItems.value.map(baseItemId => {
            let baseItem = allBaseItems.value.find(({ id }) => id === baseItemId)
            let category = allCategories.value.find(({ id }) => id === baseItem?.categoryId)
            return category?.id!
        }).reduce((acc, val) => {
            if (!acc.includes(val)) {
                acc.push(val)
            }
            return acc
        }, new Array<number>())
    } else if (changedProperty === 'categories') {
        // propagate down based on selected categories
        selectedBaseItems.value = selectedCategories.value.map(id => {
            return allBaseItems.value.filter(({ categoryId }) => categoryId === id).map(({ id }) => id!)
        }).flat()
        selectedItems.value = selectedBaseItems.value.map(id => {
            return allItems.value.filter(({ baseItemId }) => baseItemId === id).map(({ id }) => id!)
        }).flat()
    } else if (changedProperty === 'base-items') {
        // propagate up and down based on the selected base-items
        selectedCategories.value = selectedBaseItems.value.map(baseItemId => {
            let baseItem = allBaseItems.value.find(({ id }) => id === baseItemId)
            let category = allCategories.value.find(({ id }) => id === baseItem?.categoryId)
            return category?.id!
        }).reduce((acc, val) => {
            if (!acc.includes(val)) {
                acc.push(val)
            }
            return acc
        }, new Array<number>())
        selectedItems.value = selectedBaseItems.value.map(id => {
            return allItems.value.filter(({ baseItemId }) => baseItemId === id).map(({ id }) => id!)
        }).flat()
    }
    // pushing back the remaining execution so that the computed gets updated
    await nextTick()
    if (!timeframeManuallyFixed.value) {
        let start: moment.Moment | null = null
        let end: moment.Moment | null = null
        allOrderedItemsByNameAndSelection.value.forEach(orderedItem => {
            let now = moment(orderedItem.createdAt)
            if (!start) {
                start = now.clone()
            }
            if (!end) {
                end = now.clone()
            }
            if (now.isBefore(start)) {
                start = now.clone()
            }
            if (now.isAfter(end)) {
                end = now.clone()
            }
        })
        if (start) {
            (start as moment.Moment).subtract(30, 'minutes')
            startDate.value = new Date((start as moment.Moment).toISOString())
            startTime.value = (start as moment.Moment).format('HH:mm')
        }
        if (end) {
            (end as moment.Moment).add(30, 'minutes')
            endDate.value = new Date((end as moment.Moment).toISOString())
            endTime.value = (end as moment.Moment).format('HH:mm')
        }
    }
}

const datasetStart = computed(() => {
    return moment(`${startDate.value?.toDateString()} ${startTime.value}`)
})
const datasetEnd = computed(() => {
    return moment(`${endDate.value?.toDateString()} ${endTime.value}`)
})
const orderedItemsForDataset = computed(() => {
    return allOrderedItemsByNameAndSelection.value.filter(({ createdAt }) => moment(createdAt).isBetween(datasetStart.value, datasetEnd.value, null, '[]'))
})

const dataset = computed<ChartData<'line'>>(() => {
    let timeslices: Array<{ start: moment.Moment, end: moment.Moment }> = []
    let labels:     Array<string> = []
    let datasets:   Array<{ label: string, data: Array<number>, itemId: number }> = orderedItemsForDataset.value
        .map(({ itemId }) => itemId!)
        .reduce((acc, val) => {
            if (!acc.includes(val)) {
                acc.push(val)
            }
            return acc
        }, new Array<number>())
        .map(itemId => {
            return {
                itemId,
                label: allFullItems.value.find(({ id }) => id === itemId)?.name!,
                backgroundColor: '#f87979',
                borderColor: '#f87979',
                data: []
            }
        })
    if (timeframeFormat.value === 'hour') {
        let start = datasetStart.value.clone().startOf('hour')
        let end =   datasetEnd.value.clone().endOf('hour')
        let cur =   start.clone()
        while (cur.isBefore(end)) {
            timeslices.push({ start: cur.clone(), end: cur.add(1, 'hour').clone() })
        }
        timeslices.forEach(({ start, end }, index, { length }) => {
            let label = ''
            if (index === 0) {
                label = `${start.format('DD.MM. HH:mm')} - ${end.format('HH:mm')}`
            } else if (index === length - 1) {
                label = `${start.format('HH:mm')} - ${end.format('HH:mm DD.MM.')}`
            } else {
                label = `${start.format('HH:mm')} - ${end.format('HH:mm')}`
            }
            labels.push(label)
        })
    } else if (timeframeFormat.value === 'day') {
        let start = datasetStart.value.clone().startOf('day')
        let end =   datasetEnd.value.clone().endOf('day')
        let cur =   start.clone()
        while (cur.isBefore(end)) {
            timeslices.push({ start: cur.clone(), end: cur.add(1, 'day').clone() })
        }
        timeslices.forEach(({ start, end }, index, { length }) => {
            let label = ''
            if (index === 0) {
                label = `${start.format('MMM DD.')}`
            } else if (index === length - 1) {
                label = `${start.format('DD. MMM')}`
            } else {
                label = `${start.format('DD.')}`
            }
            labels.push(label)
        })
    } else {
        let start = datasetStart.value.clone().startOf('month')
        let end =   datasetEnd.value.clone().endOf('month')
        let cur =   start.clone()
        while (cur.isBefore(end)) {
            timeslices.push({ start: cur.clone(), end: cur.add(1, 'month').clone() })
        }
        timeslices.forEach(({ start, end }, index, { length }) => {
            let label = ''
            if (index === 0) {
                label = `${start.format('YYYY MMM')}`
            } else if (index === length - 1) {
                label = `${start.format('MMM YYYY')}`
            } else {
                label = `${start.format('MMM')}`
            }
            labels.push(label)
        })
    }
    timeslices.forEach(({ start, end }) => {
        let orderedItemsInSlice = orderedItemsForDataset.value.filter(({ createdAt }) => {
            return moment(createdAt).isBetween(start, end, null, '[)')
        })
        datasets.forEach(({ itemId: id, data }) => {
            data.push(orderedItemsInSlice.filter(({ itemId }) => itemId === id).reduce((acc, val) => acc + val.quantity!, 0))
        })
    })
    return {
        labels,
        datasets
    }
})
const options = computed(() => {
    return {
        responsive: true,
        maintainAspectRation: true
    }
})
</script>