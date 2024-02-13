<template>
    <v-dialog v-model="dialog" width="70%">
        <template v-slot:activator="{ props }">
            <v-btn dark class="mb-2" variant="outlined" v-bind="props" @click="init">
                <slot name="button">New</slot>
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                <slot name="dialog-title">Create new Item</slot>
            </v-card-title>
            <v-card-text>
                <v-container fluid>
                    <v-row>
                        <v-col v-for="header in props.headers.filter(({ value }) => value !== 'id')" cols="4">
                            <v-text-field v-if="header.type === 'string'" v-model="model[header.value]" :density="'compact'"
                                :label="header.title"
                                :rules="props.optional?.includes(header.value) ? [] : [rules.required]" />
                            <v-text-field v-if="header.type === 'number'" :type="'number'" v-model="model[header.value]"
                                :density="'compact'" :label="header.title"
                                :rules="props.optional?.includes(header.value) ? [] : [rules.required]" />
                            <v-switch v-if="header.type === 'boolean'" v-model="model[header.value]" :density="'compact'"
                                color="primary" :label="header.title"
                                :rules="props.optional?.includes(header.value) ? [] : [rules.required]" />
                            <v-select v-if="header.type === 'select'" :items="header.selectFrom"
                                v-model="model[header.value]" item-value="id" item-title="name" :density="'compact'"
                                :label="header.title"
                                :rules="props.optional?.includes(header.value) ? [] : [rules.required]" />
                        </v-col>
                    </v-row>
                    <v-alert v-model="errorState" v-if="error" title="Feler beim Erstellen!" :text="error" closable
                        type="error" @click:close="resetError" />
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">
                    Abbrechen
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">
                    Erstellen
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { ServiceTypes } from 'backend';
const { api } = useFeathers()
interface I {
    value: string,
    readonly?: boolean,
    title?: string,
    type: 'string' | 'number' | 'boolean' | 'select',
    selectFrom?: Array<any>,
    width?: string
}
interface NewItemDialogProps {
    headers: Array<I>,
    serviceName: keyof ServiceTypes,
    defaultConfig?: any,
    optional?: Array<string>
}
const props = defineProps<NewItemDialogProps>()
const dialog = ref(false)
const loading = ref(false)
const errorState = ref(false)
const error = ref('')
const model = ref<any>({})
const rules = {
    required: (value: any) => !!value || 'Notwendig!'
}
const init = function () {
    model.value = { ...JSON.parse(JSON.stringify(props.defaultConfig || {})) }
}
const close = function () {
    dialog.value = false
    setTimeout(() => { init(); resetError() }, 500)
}
const save = async function () {
    loading.value = true
    let data = api.service(props.serviceName).createInStore(model)
    console.log(data)
    await data.save().catch((err: Error) => {
        errorState.value = true
        error.value = err.message + '\n' + JSON.stringify(err, null, '\t')
    })
    loading.value = false
    if (!errorState.value) {
        close()
    }
}
const resetError = function () {
    error.value = ''
    errorState.value = false
}
</script>