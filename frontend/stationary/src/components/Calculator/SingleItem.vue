<template>
    <v-card v-bind="props" :style="{ height: '100%', ...style }" :disabled="props.disabled || !baseItem.available" @click="addToOrder" :color="category?.color">
        <v-card-text class="text-center mx-auto">
            <span>{{ `${displayName}` }}</span>
            <br />
            <span>{{ item.price }}€</span>
            <br />
            <span v-if="!baseItem.available">(ausverkauft)</span>
        </v-card-text>
    </v-card>
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
const item = api.service('items').getFromStore(toRef(props.itemId))
const baseItem = api.service('base-items').getFromStore(computed(() => item.value.baseItemId!))
const category = api.service('categories').getFromStore(computed(() => baseItem.value.categoryId!))
const size = api.service('sizes').getFromStore(computed(() => item.value.sizeId!))
const flavour = api.service('base-items').getFromStore(computed(() => item.value.flavourId!))

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
const displayName = computed(() => {
    let sizeName = ''
    let baseItemName = baseItem.value?.name || ''
    let flavourName = ''
    if (size.value) {
        if (!(size.value.name === '-' && usersettings.shortenDisplayName)) {
            sizeName = size.value.name + ' '
        }
    }
    if (flavour.value) {
        if (!(flavour.value.name === '-' && usersettings.shortenDisplayName)) {
            flavourName = ' ' + flavour.value.name
        }
    }
    return sizeName + baseItemName + flavourName
})

const addToOrder = function () {
    // ref needed otherwise __isTemp property cannot be queried
    let alreadyFoundItem = api.service('ordered-items').findInStore(ref({
        query: {
            itemId: props.itemId,
            waiter: usersettings.getName!,
            tenantId: auth.user.tenantId as number,
            __isTemp: true
        },
        temps: true
    })).data
    if (alreadyFoundItem[0]) {
        let clone = alreadyFoundItem[0].clone()
        clone.quantity! += 1
        clone.commit()
    } else {
        api.service('ordered-items').createInStore({
            itemId: props.itemId,
            quantity: 1,
            tenantId: auth.user.tenantId as number,
            orderId: 0, // use 0 as orderId as there is not yet a valid order, the order is created when the order is finalized
            open: 0,
            notCashed: 0
        })
    }
    // utilities.setNotification({ message: `${amount.value} x ${baseItem.value.name} wurde erfolgreich zur Bestellung hinzugefügt!`, timeout: 3000, type: 'success' })
}
</script>