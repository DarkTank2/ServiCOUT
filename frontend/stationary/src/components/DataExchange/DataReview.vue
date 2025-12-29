<template>
    <v-card max-height="500px" :title="'Vorschau und Änderungen'">
        <template #append>
            <span>Es sind <span class="font-weight-black">{{ selectionModel.length }}</span> Produkte ausgewählt!</span>
        </template>
        <template #text>
            <v-table density="compact" fixed-header height="400px">
                <thead>
                    <tr>
                        <td>
                            <v-checkbox hide-details :model-value="selectionModel.length === model.length"
                                :indeterminate="selectionModel.length > 0 && selectionModel.length !== model.length"
                                @update:model-value="updateAllLineSelection"></v-checkbox>
                        </td>
                        <td v-for="h in props.header.filter(h => !!h)">
                            {{ h.name }}
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(line, l_i) in modifiedData">
                        <td><v-checkbox hide-details v-model="selectionModel" :value="l_i"></v-checkbox></td>
                        <td v-for="(cell, c_i) in line" :style="{ backgroundColor: cell.bgColor }"
                            @click="selectCell(l_i, c_i)">
                            <span>{{ cell.value }}</span>
                            <v-tooltip v-if="cell.exists" max-width="200px">
                                <template v-slot:activator="{ props: activatorProps }">
                                    <v-btn density="compact" flat icon v-bind="activatorProps">
                                        <v-icon icon="mdi-information-outline" color="info"></v-icon>
                                    </v-btn>
                                </template>
                                <div>{{ existmentTexts[cell.exists] }}</div>
                            </v-tooltip>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </template>
    </v-card>
    <v-navigation-drawer location="right" v-model="editNavBar">
        <template v-slot:prepend>
            <v-list-item title="Bearbeiten"></v-list-item>
        </template>

        <v-divider></v-divider>

        <div class="mx-4 mt-1">
            <v-chip v-for="s in selectedCell.filter(({ v }) => v && !['', ' '].includes(v))" :text="s.v"
                class="mr-1 my-1" append-icon="mdi-content-copy" @click="replacementText = s.v"></v-chip>
        </div>
        <v-list density="compact">
            <v-list-item>
                <template #title>
                    <v-text-field v-model="replacementText" label="Neuer Wert" density="compact" class="mt-2"
                        clearable></v-text-field>
                </template>
            </v-list-item>
        </v-list>
        <v-list-item>
            <template #title>
                <v-btn block color="primary" :disabled="!replacementText" @click="apply"><v-icon
                        icon="mdi-check"></v-icon>Anwenden</v-btn>
            </template>
        </v-list-item>
        <v-list-item>
            <template #title>
                <v-btn block variant="outlined" color="primary" :disabled="!replacementText" @click="applyAll"><v-icon
                        icon="mdi-check-all"></v-icon>Auf alle Anwenden <br />({{ countedSimilarCells }}
                    Einträge)</v-btn>
            </template>
        </v-list-item>
    </v-navigation-drawer>
</template>
<script setup lang="ts">
import type { Header, HeaderKey } from './HeaderMapper.vue';

const { api } = useFeathers()
const { data: allCategories } = toRefs(api.service('categories').findInStore(computed(() => ({}))))
const { data: allBaseItems } = toRefs(api.service('base-items').findInStore(computed(() => ({}))))
const { data: allSizes } = toRefs(api.service('sizes').findInStore(computed(() => ({}))))
const { data: allFlavours } = toRefs(api.service('flavours').findInStore(computed(() => ({}))))

export interface DataReviewProps {
    header: Array<Header | undefined>
}
const props = defineProps<DataReviewProps>()
const emit = defineEmits<{ (e: 'selected', value: Array<Selection>): void }>()
const model = defineModel<Matrix<string>>({ required: true })
const selectionModel = defineModel<Array<number>>('selection', { required: true })
const modifiedData = ref<Matrix<ModifiedData>>([])

type Selection = { l: number, c: number, v: string }
type ModifiedData = {
    value: string,
    bgColor?: string,
    exists?: HeaderKey
}
type Matrix<T> = Array<Array<T>>
const selectedCell = ref<Array<Selection>>([])
const control = ref(false)
const editNavBar = ref(false)
const replacementText = ref<string>()
const existmentTexts = ref<{ [K in HeaderKey]?: string }>({
    'category': 'Die Kategorie existiert bereits, sie wird daher nicht neu angelegt!',
    'base-item': 'Das Basis-Produkt existiert bereits, es wird daher nicht neu angelegt!',
    'size': 'Die Größe existiert bereits, sie wird daher nicht neu angelegt!',
    'flavour': 'Die Ausrichtung existiert bereits, sie wird daher nicht neu angelegt!'
})

const bundledApiData = computed<{ [K in HeaderKey]?: any[] }>(() => {
    return {
        'category': allCategories.value,
        'base-item': allBaseItems.value,
        'flavour': allFlavours.value,
        'size': allSizes.value
    }
})
const similarCells = computed(() => {
    let tuplesToBeEdited: Array<{ l: number, c: number }> = []
    model.value.forEach((line, l) => {
        line.forEach((cell, c_i) => {
            if (selectedCell.value.some(({ c, v }) => c === c_i && v === cell)) {
                tuplesToBeEdited.push({ l, c: c_i })
            }
        })
    })
    return tuplesToBeEdited
})
const countedSimilarCells = computed(() => {
    return similarCells.value.length
})

const selectCell = function (lineIndex: number, cellIndex: number) {
    let value = model.value.at(lineIndex)?.at(cellIndex)!
    let selection = { l: lineIndex, c: cellIndex, v: value }
    if (control.value) {
        if (selectedCell.value.some(s => s.l === lineIndex && s.c === cellIndex)) {
            selectedCell.value = selectedCell.value.filter(s => !(s.l === lineIndex && s.c === cellIndex))
        } else {
            selectedCell.value.push(selection)
        }
    } else if (selectedCell.value.length === 1 && selectedCell.value.some(s => s.l === lineIndex && s.c === cellIndex)) {
        selectedCell.value = []
    } else {
        selectedCell.value = [selection]
    }
    emit('selected', selectedCell.value)
    if (selectedCell.value.length === 0) {
        editNavBar.value = false
    } else {
        editNavBar.value = true
        if (selectedCell.value.length === 1) {
            replacementText.value = selectedCell.value[0]?.v
        }
    }
    modifiedData.value = modifyData()
}
const apply = function () {
    selectedCell.value.forEach(s => {
        if (!replacementText.value) return
        if (model.value[s.l] === undefined) return
        (model.value[s.l]!)[s.c] = replacementText.value
    })
    replacementText.value = undefined
    editNavBar.value = false
}
const applyAll = function () {
    if (!replacementText.value) return
    similarCells.value.forEach(({ l, c }) => {
        (model.value[l]!)[c] = replacementText.value!
    })
    replacementText.value = undefined
    editNavBar.value = false
}
const updateAllLineSelection = function () {
    if (selectionModel.value.length !== model.value.length) {
        selectionModel.value = model.value.map((_, i) => i)
    } else {
        selectionModel.value = []
    }
}

// sadly due to the limitations of reactivity and arrays, this must be triggered via a watcher
// the reactivity of arrays bubbles down to the reference to said array and cannot be extended to the content of the array
// thus a change of one index in the array wont trigger a computed depending on the array
// this is the case with the model as a matrix
// this solution is very costly, especially with large csv-files, but currently there is no need for further investigation
const modifyData = function () {
    return model.value.map((l, l_i) => {
        return l.map((c, c_i) => {
            let data: ModifiedData = { value: c }
            let head = props.header.at(c_i)
            if (selectedCell.value.some(s => s.c === c_i && s.l === l_i)) {
                data.bgColor = 'rgba(var(--v-theme-success), 0.7)'
            } else if (selectedCell.value.some(s => s.v === c && s.c === c_i)) {
                data.bgColor = 'rgba(var(--v-theme-warning), 0.7)'
            }
            if (head && bundledApiData.value[head.key]) {
                if (bundledApiData.value[head.key]!.some(({ name }) => name === c)) {
                    data.exists = head.key
                }
            }
            return data
        })
    })
}

watch([model, allCategories, allBaseItems, allSizes, allFlavours], () => {
    selectedCell.value = []
    modifiedData.value = modifyData()
}, { deep: true, immediate: true })

const handleKeyDown = function (e: KeyboardEvent) {
    if (e.key === 'Control') {
        control.value = true
    }
}
const handleKeyUp = function (e: KeyboardEvent) {
    if (e.key === 'Control') {
        control.value = false
    }
}
onMounted(() => {
    globalThis.addEventListener('keydown', handleKeyDown)
    globalThis.addEventListener('keyup', handleKeyUp)
})
onBeforeUnmount(() => {
    globalThis.removeEventListener('keydown', handleKeyDown)
    globalThis.removeEventListener('keyup', handleKeyUp)
})
</script>
<style lang="css" scoped>
td {
    background-color: rgb(var(--v-theme-surface));
}

tbody>tr>td,
span.v-chip {
    cursor: pointer;
}

tbody>tr>td:hover,
span.v-chip:hover {
    background-color: rgba(var(--v-theme-surface-variant), var(--v-hover-opacity));
}
</style>