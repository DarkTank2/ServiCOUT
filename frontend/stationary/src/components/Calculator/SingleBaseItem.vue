<template>
    <v-dialog v-model="dialogModel" fullscreen scrollable :scrim="false" @update:model-value="updateDialog">
        <template #activator="{ props }">
            <v-card v-bind="props" :style="style" :disabled="props.disabled || !baseItem.available">
                <v-card-text class="text-center mx-auto">
                    {{ `${baseItem.name}` }}
                    <br />
                    <span v-if="!baseItem.available">(ausverkauft)</span>
                    <slot name="external-disable-message"></slot>
                </v-card-text>
            </v-card>
        </template>
        <template #default="{ isActive }">
            <v-card>
                <v-system-bar window :style="{ top: '0px' }">
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" class="ms-2" @click.stop="isActive.value = false"></v-btn>
                </v-system-bar>
                <v-toolbar :style="{ marginTop: '32px' }">
                    <v-toolbar-title>
                        {{ baseItem.name }}
                    </v-toolbar-title>
                    <v-toolbar-title>
                        {{ `( à ${selectedItem?.price || '?'}€ )` }}
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text :style="{ paddingTop: '40px' }">
                    <template v-if="baseItem.description">
                        <span class="text-body-1">Beschreibung:</span>
                        <br />
                        <span class="text-grey-lighten-1">{{ baseItem.description }}</span>
                        <v-divider :style="{ 'margin-top': '4px' }"></v-divider>
                    </template>
                    <span class="text-body-1">Menge:</span>
                    <v-list-item :style="{ textAlign: 'center' }">
                        <template #prepend>
                            <v-btn icon="mdi-minus" @click.stop="decrement" :disabled="amount <= 1"></v-btn>
                        </template>
                        <v-btn disabled variant="outlined" rounded class="text-white" :style="{ opacity: 1 }">{{ amount
                        }}</v-btn>
                        <template #append>
                            <v-btn icon="mdi-plus" @click.stop="increment"></v-btn>
                        </template>
                    </v-list-item>
                    <v-divider></v-divider>
                    <span class="text-body-1">Variationen:</span>
                    <v-radio-group v-model="flavourId" density="compact"
                        :error-messages="selectedItem ? null : 'Ungültige Kombination!'">
                        <v-radio v-for="flavour in flavours" :key="`flavour_id_${flavour.id}_base_item_id_${baseItem.id}`"
                            :value="flavour.id">
                            <template #label>
                                <span :class="{ 'text-success': possibleFlavours.includes(flavour.id) }">{{ flavour.name
                                }}</span>
                            </template>
                        </v-radio>
                    </v-radio-group>
                    <v-divider></v-divider>
                    <span class="text-body-1">Größen:</span>
                    <v-radio-group v-model="sizeId" density="compact"
                        :error-messages="selectedItem ? null : 'Ungültige Kombination!'">
                        <v-radio v-for="size in sizes" :key="`size_id_${size.id}_base_item_id_${baseItem.id}`"
                            :value="size.id">
                            <template #label>
                                <span :class="{ 'text-success': possibleSizes.includes(size.id) }">{{ size.name }}</span>
                            </template>
                        </v-radio>
                    </v-radio-group>
                    <v-divider></v-divider>
                    <v-textarea label="Kommentar" v-model="comment" hint="Füge diesem Item ein Kommentar hinzu."
                        variant="outlined" density="compact" clearable class="py-5" />
                    <!-- <v-divider></v-divider>
                    <span class="text-body-1">Optionen:</span> -->
                </v-card-text>
                <v-card-actions :style="{ 'padding-left': '24px', 'padding-right': '24px', 'padding-bottom': '24px' }">
                    <v-btn block elevation="2" variant="outlined" rounded :disabled="!selectedItem"
                        @click.stop="addToOrder">
                        Zur Bestellung hinzufügen
                        <v-icon icon="mdi-cart-plus"></v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup lang="ts">
import { CSSProperties } from 'vue';
import colors from 'vuetify/util/colors'

const { api } = useFeathers()
const usersettings = useUsersettings()
const auth = useAuthStore()
// const utilities = useUtilityStore()

const props = defineProps<{
    itemId: number,
    style?: CSSProperties,
    disabled?: boolean
}>()
const dialogModel = ref(false)
const amount = ref(1)
const sizeId = ref<number | null>(null)
const flavourId = ref<number | null>(null)
const comment = ref<string | undefined>(undefined)

const baseItem = api.service('base-items').getFromStore(toRef(props.itemId))

const { data: items } = toRefs(api.service('items').findInStore(computed(() => ({ query: { baseItemId: baseItem.value.id } }))))
let sizesQuery = computed(() => ({
    query: { id: { $in: items.value.map(({ sizeId }) => sizeId!) } }
}))
let flavoursQuery = computed(() => ({
    query: { id: { $in: items.value.map(({ flavourId }) => flavourId!) } }
}))
const { data: sizes } = toRefs(api.service('sizes').findInStore(sizesQuery))
const { data: flavours } = toRefs(api.service('flavours').findInStore(flavoursQuery))
const possibleFlavours = computed(() => {
    if (selectedItem.value) {
        return []
    }
    return items.value.filter(item => item.sizeId === sizeId.value).map(({ flavourId }) => flavourId)
})
const possibleSizes = computed(() => {
    if (selectedItem.value) {
        return []
    }
    return items.value.filter(item => item.flavourId === flavourId.value).map(({ sizeId }) => sizeId)
})
const defaultItem = computed(() => {
    return items.value.find((item) => item.default) || items.value[0]
})
const finishedLoading = computed(() => {
    return (sizes.value.length > 0) && (flavours.value.length > 0)
})
const selectedItem = computed(() => {
    return items.value.find((item) => item.flavourId === flavourId.value && item.sizeId === sizeId.value)
})

const style = computed(() => {
    let _style: CSSProperties = {}
    if (props.style) {
        Object.assign(_style, props.style)
    }
    if (!baseItem.value.available) {
        _style.background = colors.grey.base
    }
    return _style
})

const updateDialog = function (modelValue: boolean) {
    // if the dialog gets opened or closed always reset everything, do this on open as well as close because it is easier
    amount.value = 1
    flavourId.value = defaultItem.value?.flavourId!
    sizeId.value = defaultItem.value?.sizeId!
    comment.value = undefined
}
const increment = function () {
    amount.value += 1
}
const decrement = function () {
    amount.value -= 1
    if (amount.value < 1) {
        amount.value = 1
    }
}

const addToOrder = function () {
    // ref needed otherwise __isTemp property cannot be queried
    let alreadyFoundItem = api.service('ordered-items').findInStore(ref({
        query: {
            itemId: selectedItem.value?.id!,
            waiter: usersettings.getName!,
            tableId: usersettings.getTableId!,
            tenantId: auth.user.tenantId as number,
            __isTemp: true
        },
        temps: true
    })).data
    // comment is not query-able as of ritgh now, mybe change in future at backend and add it to query here
    if (alreadyFoundItem[0] && alreadyFoundItem[0].comment === comment.value) {
        let clone = alreadyFoundItem[0].clone()
        clone.quantity! += amount.value
        clone.commit()
    } else {
        api.service('ordered-items').createInStore({
            itemId: selectedItem.value?.id!,
            quantity: amount.value,
            tenantId: auth.user.tenantId as number,
            comment: comment.value,
            orderId: 0, // use 0 as orderId as there is not yet a valid order, the order is created when the order is finalized
            open: amount.value,
            notCashed: amount.value
        })
    }
    dialogModel.value = false
    updateDialog(false)
    // utilities.setNotification({ message: `${amount.value} x ${baseItem.value.name} wurde erfolgreich zur Bestellung hinzugefügt!`, timeout: 3000, type: 'success' })
}
</script>