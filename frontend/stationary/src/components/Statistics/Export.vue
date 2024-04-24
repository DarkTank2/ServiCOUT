<template>
    <v-dialog max-width="80%" v-model="dialog">
        <template #activator="{ props }">
            <v-fab v-bind="props" icon="mdi-download" location="bottom right" :app="true"
                :style="{ position: 'fixed' }" :disabled="data.length === 0"></v-fab>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card title="Export-Einstellungen zum CSV-Download">
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="6">
                                <v-switch v-model="includeHeaders" label="Inkludiere Header als erste Zeile"
                                    color="primary"></v-switch>
                            </v-col>
                            <v-col cols="6">
                                <v-switch v-model="includeAllItems" label="Füge eine Liste alle Produkte in der Datei hinzu"
                                    color="primary"></v-switch>
                            </v-col>
                            <v-col cols="2" v-for="i in 6" :key="`header_select_index_${i - 1}`">
                                <v-select v-model="headers[i - 1]" :label="`Spalte #${i}`" :items="possibleHeaders"
                                    item-value="value" item-title="title" clearable variant="outlined"></v-select>
                            </v-col>
                            <v-col cols="12" class="px-0">
                                <v-data-table :headers="modifiedHeaders" :items="modifiedData"
                                    density="compact">
                                    <template v-for="header in modifiedHeaders" #[`header.${header.value}`]>
                                        <span v-if="includeHeaders">{{ header.title }}</span>
                                        <span v-else></span>
                                    </template>
                                    <template #bottom>
                                        <!-- Hide bottom controls -->
                                        <div></div>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="CSV Herunterladen" @click="download" variant="outlined"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup lang="ts">
import moment from 'moment';

const emit = defineEmits<{ (e: 'save'): void }>()

const { api } = useFeathers()

const dialog = ref<boolean>(false)

const includeHeaders = defineModel<boolean>('includeHeaders', { required: true })
const includeAllItems = defineModel<boolean>('includeAllItems', { required: true })
type HeaderValue = 'date' | 'time' | 'item' | 'quantity' | 'price' | 'timestamp' | undefined | null
const headers = defineModel<Array<HeaderValue>>('headers', { required: true })
const possibleHeaders = [
    {
        title: 'Datum',
        value: 'date'
    },
    {
        title: 'Zeit',
        value: 'time'
    },
    {
        title: 'Produkt',
        value: 'item'
    },
    {
        title: 'Anzahl',
        value: 'quantity'
    },
    {
        title: 'Preis',
        value: 'price'
    },
    {
        title: 'Zeitstempel',
        value: 'timestamp'
    }
]
interface ExportModalProps {
    data: Array<any>
}
const props = defineProps<ExportModalProps>()
const modifiedHeaders = computed(() => {
    return headers.value.map((header, _, array) => {
        return {
            ...possibleHeaders.find(({ value }) => value === header)!,
            width: `${100 / array.length}%`
        }
    })
})
const modifiedData = computed(() => {
    return props.data.slice(0, 5).map((orderedItem) => {
        let item = api.service('items').getFromStore(orderedItem.itemId)
        let size = api.service('sizes').getFromStore(item.value.sizeId!)
        let flavour = api.service('flavours').getFromStore(item.value.flavourId!)
        let baseItem = api.service('base-items').getFromStore(item.value.baseItemId!)
        return {
            date: moment(orderedItem.createdAt).format('YYYY-MM-DD'),
            time: moment(orderedItem.createdAt).format('HH:mm:ss'),
            timestamp: moment(orderedItem.createdAt).format(),
            price: item.value.price,
            item: `${size.value.name} ${baseItem.value.name} ${flavour.value.name}`,
            quantity: orderedItem.quantity
        }
    })
})
const download = function () {
    dialog.value = false
    emit('save')
}
</script>