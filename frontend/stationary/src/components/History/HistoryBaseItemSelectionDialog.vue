<template>
    <v-dialog :model-value="props.baseItemId !== undefined" scrollable max-width="60vw" @click:outside="emit('clear')">
        <template #default="{ isActive }">
            <v-card>
                <v-system-bar window :style="{ top: '0px' }">
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" class="ms-2" @click.stop="() => { isActive.value = false; emit('clear') }"></v-btn>
                </v-system-bar>
                <v-toolbar :style="{ marginTop: '32px' }">
                    <v-toolbar-title>
                        {{ selectedBaseItem?.name }}
                    </v-toolbar-title>
                    <v-toolbar-title>
                        {{ `( à ${selectedItem?.price || '?'}€ )` }}
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text :style="{ paddingTop: '40px' }">
                    <template v-if="selectedBaseItem?.description">
                        <span class="text-body-1">Beschreibung:</span>
                        <br />
                        <span class="text-grey-lighten-1">{{ selectedBaseItem.description }}</span>
                        <v-divider :style="{ 'margin-top': '4px' }"></v-divider>
                    </template>
                    <span class="text-body-1">Menge:</span>
                    <v-list-item :style="{ textAlign: 'center' }">
                        <template #prepend>
                            <v-btn icon="mdi-minus" @click.stop="amount = Math.max(amount - 1, 1)"
                                :disabled="amount <= 1"></v-btn>
                        </template>
                        <v-btn disabled variant="outlined" rounded class="text-white" :style="{ opacity: 1 }">{{ amount
                        }}</v-btn>
                        <template #append>
                            <v-btn icon="mdi-plus" @click.stop="amount += 1"></v-btn>
                        </template>
                    </v-list-item>
                    <v-divider></v-divider>
                    <span class="text-body-1">Variationen:</span>
                    <v-radio-group v-model="flavourId" density="compact"
                        :error-messages="selectedItem ? null : 'Ungültige Kombination!'">
                        <v-radio v-for="flavour in flavours"
                            :key="`flavour_id_${flavour.id}_base_item_id_${selectedBaseItem?.id}`" :value="flavour.id">
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
                        <v-radio v-for="size in sizes" :key="`size_id_${size.id}_base_item_id_${selectedBaseItem?.id}`"
                            :value="size.id">
                            <template #label>
                                <span :class="{ 'text-success': possibleSizes.includes(size.id) }">{{ size.name
                                    }}</span>
                            </template>
                        </v-radio>
                    </v-radio-group>
                    <v-divider></v-divider>
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
const { api } = useFeathers()

interface HistoryBaseItemSelectionDialogProps {
    baseItemId?: number
}
const props = defineProps<HistoryBaseItemSelectionDialogProps>()
const emit = defineEmits<{(e: 'selected', itemId: number, amount: number): void, (e: 'clear'): void}>()

const amount = ref(1)
const sizeId = ref<number | null>(null)
const flavourId = ref<number | null>(null)
const selectedBaseItem = computed(() => {
    if (!props.baseItemId) return
    return api.service('base-items').getFromStore(props.baseItemId).value
})
const { data: items } = toRefs(api.service('items').findInStore(computed(() => ({ query: { baseItemId: selectedBaseItem.value?.id } }))))
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
const selectedItem = computed(() => {
    return items.value.find((item) => item.flavourId === flavourId.value && item.sizeId === sizeId.value)
})

const addToOrder = function () {
    if (!selectedItem.value) return
    emit('selected', selectedItem.value.id!, amount.value)
}
</script>