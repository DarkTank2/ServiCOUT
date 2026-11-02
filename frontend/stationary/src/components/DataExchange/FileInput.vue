<template>
    <v-row>
        <v-col cols="3">
            <v-select
            v-model="selectedLineSplitter"
            label="Zeilenumbruch"
            :items="[{ title: 'Newline', value: '\n' }, { title: 'Carriage-return-linefeed', value: '\r\n' }]"
            hide-details
            density="compact"
            ></v-select>
        </v-col>
        <v-col cols="3">
            <v-select
            v-model="selectedCellSplitter"
            label="Trennzeichen"
            :items="[{ title: 'Semicolon', value: ';' }, { title: 'Colon', value: ',' }]"
            hide-details
            density="compact"
            ></v-select>
        </v-col>
        <v-col>
            <v-switch v-model="headerLineIncluded" label="Erste Zeile = Header" color="primary" hide-details density="compact"></v-switch>
        </v-col>
        <v-col cols="2">
            <v-btn
            @click="update"
            :color="currentState === 'sync-file' ? 'primary' : undefined"
            :disabled="parsedFileContent.length === 0">Übernehmen</v-btn>
        </v-col>
    </v-row>
    <v-card flat class="bordered my-2"
    :style="{ 'border-color': hoverActive ? 'rgb(var(--v-theme-primary))' : 'rgba(var(--v-border-color), var(--v-border-opacity))' }"
        style="border-width: 2px; border-style: dashed; height: 100%; width: 100%;">
        <div class="d-flex align-center justify-center fill-height mx-auto"
            style="flex-direction: column;" id="single-drop-zone" :ondrop="handleFileDrops"
            :ondragover="handleDragOver" :ondragleave="handleDragLeave">
            <span style="text-align: center;" class="mt-5">Zieh eine Datei hier hinein, oder lade es
                über die
                folgende Schaltfläche:</span>
            <br />
            <v-file-input
            density="compact"
            ref="file-input"
            :model-value="fileModel"
            @update:model-value="handleFileModelChange"
            width="500px"
            clearable
            label="Datei auswählen"
            variant="outlined"
            accept=".csv"
            hide-details
            class="mb-5"
            prepend-icon="mdi-file-delimited-outline"
            ></v-file-input>
        </div>
    </v-card>
    <span class="text-h5">Vorschau:</span>
    <v-table density="compact">
        <tbody>
            <tr v-for="line in parsedFileContent.slice(0, 5)" >
                <td v-for="cell in line">
                    <span v-if="cell === ''">...</span>
                    <span v-else>{{ cell }}</span>
                </td>
            </tr>
            <tr v-if="parsedFileContent.length > 5"><td>+{{ parsedFileContent.length - 5 }} mehr</td></tr>
        </tbody>
    </v-table>
</template>
<script setup lang="ts">
const emit = defineEmits<{ (e: 'update', value: Array<Array<string>>, isHeaderIncluded: boolean): void} >()
const fileModel = ref<File>()
const rawFileContent = ref<string>()
const selectedLineSplitter = ref<string>()
const selectedCellSplitter = ref<string>()
const hoverActive = ref(false)
const headerLineIncluded = ref(true)
const currentState = ref<'select-file' | 'sync-file' | 'file-synced'>('select-file')

const handleFileDrops = async function (ev: DragEvent) {
    ev.preventDefault()
    if (!ev.dataTransfer) {
        return
    }
    const { files } = ev.dataTransfer
    const size = files.length
    const extractedFiles = new Array(size)
        .fill(null)
        .map((_, i) => files.item(i))
        .filter(file => !!file)
        .filter(file => file?.type.includes('csv'))
    if (extractedFiles.length === 0) {
        return
    }
    let file = extractedFiles[0]!
    fileModel.value = file
    hoverActive.value = false
}
const handleDragOver = function (ev: DragEvent) {
    ev.preventDefault()
    hoverActive.value = true
}
const handleDragLeave = function (ev: DragEvent) {
    ev.preventDefault()
    hoverActive.value = false
}

const handleFileModelChange = function (model: File | File[]) {
    let data: File
    if (Array.isArray(model)) {
        data = model[0]!
    } else {
        data = model
    }
    fileModel.value = data
    currentState.value = 'sync-file'
}

const parseFile = async function (newFile: File | undefined) {
    if (!newFile) {
        return
    }
    rawFileContent.value = await newFile.text()
}
watch(fileModel, parseFile, {
    deep: true
})

const parsedFileContent = computed(() => {
    if (!rawFileContent.value) {
        return []
    }
    let crlf = rawFileContent.value.match(/\r\n/g)?.length
    let nl = rawFileContent.value.match(/\n/g)?.length
    let splitted: Array<string> = []
    if (selectedLineSplitter.value) {
        splitted = rawFileContent.value.split(selectedLineSplitter.value)
    } else if (nl === undefined && crlf === undefined) {
        splitted = []
    } else if (nl && !crlf) {
        splitted = rawFileContent.value.split('\n')
    } else if (crlf && !nl) {
        splitted = rawFileContent.value.split('\r\n')
    } else if (nl && crlf && nl > crlf) {
        splitted = rawFileContent.value.split('\n')
    } else {
        splitted = rawFileContent.value.split('\r\n')
    }
    let exampleLine = splitted [0]
    let sc = exampleLine?.match(/;/g)?.length
    let c = exampleLine?.match(/,/g)?.length
    let matrixed: Array<Array<string>> = []
    splitted.forEach(line => {
        if (selectedCellSplitter.value) {
            matrixed.push(line.split(selectedCellSplitter.value))
        } else if (sc === undefined && c === undefined) {
            matrixed.push(['not determined'])
        } else if (sc && !c) {
            matrixed.push(line.split(';'))
        } else if (c && !sc) {
            matrixed.push(line.split(','))
        } else if (sc && c && sc > c) {
            matrixed.push(line.split(';'))
        } else {
            matrixed.push(line.split(','))
        }
    })
    return matrixed
})

const update = function () {
    emit('update', parsedFileContent.value, headerLineIncluded.value)
    currentState.value = 'file-synced'
}
</script>