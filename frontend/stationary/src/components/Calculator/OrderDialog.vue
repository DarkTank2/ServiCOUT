<template>
    <v-dialog v-model="model" max-width="600px" @click:outside="closeDialog">
      <v-card>
        <v-card-title class="d-flex justify-space-around">
          <span>Deine Bestellung</span>
          <span>{{ `Summe: ${roundedSum}€` }}</span>
        </v-card-title>
        <v-card-text>
          <v-list>
            <template v-for="({ orderedItem, size, flavour, baseItem, item }, i) in populatedOrderedItems">
              <v-divider v-if="i !== 0" :key="`divider_index_${i}`" />
              <v-list-item  density="compact" lines="two">
                <v-list-item-title>
                        {{ baseItem?.name }}
                        <span class="ml-2">{{ `( à ${item?.price}€ )` }}</span>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ `${flavour?.name} | ${size?.name}` }}
                    </v-list-item-subtitle>
                    <template #append>
                        <v-btn icon="mdi-minus" @click.stop="decrementAtIndex(i)"></v-btn>
                        <v-btn variant="outlined" rounded disabled class="text-white" :style="{ opacity: 1 }">{{
                            orderedItem.quantity }}</v-btn>
                        <v-btn icon="mdi-plus" @click.stop="incrementAtIndex(i)"></v-btn>
                    </template>
              </v-list-item>
              <!-- <template v-if="orderedItem.additions.length > 0">
                <span v-for="(additionId, index) in orderedItem.additions"
                  :key="`addition_index_${index}_ordered_item_index_${i}`" class="mx-10 order-component-addition">
                  {{ getAddition(additionId).name }}
                  <span v-if="getAddition(additionId).priceModifier !== 0" class="ml-2">{{ `(
                  ${getAddition(additionId).priceModifier}€ )` }}</span>
                  <br />
                </span>
              </template> -->
            </template>
            <v-list-item v-if="populatedOrderedItems.length === 0">
              <v-alert type="warning" icon="mdi-cart-plus">
                Dein Warenkorb ist leider leer, wähle Produkte aus, damit diese bestellt werden können.
              </v-alert>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="populatedOrderedItems.length === 0" @click="cash">
            Bestellung kassieren
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
const { api } = useFeathers()
const { registerShoppingCart, removeShoppingCart } = useCalculatorStore()
const { sendOrder } = useUtilityStore()
const calculator = useCalculatorStore()
const model = defineModel<boolean>()
registerShoppingCart(() => { model.value = true })
onBeforeUnmount(removeShoppingCart)

// the implementation has a bug where the return-type is wrongly set to Paginate<never>, tho it should be ComputedRef<number> as by the documentation
const countItems =              api.service('items').countInStore(computed(() => ({ query: {} }))) as any as ComputedRef<number>
const countTempOrderedItems =   api.service('ordered-items').countInStore(computed(() => ({ query: { __isTemp: true }, temps: true }))) as any as ComputedRef<number>
const countBaseItems =          api.service('base-items').countInStore(computed(() => ({ query: {} }))) as any as ComputedRef<number>
const countSizes =              api.service('sizes').countInStore(computed(() => ({ query: {} }))) as any as ComputedRef<number>
const countFlavours =           api.service('flavours').countInStore(computed(() => ({ query: {} }))) as any as ComputedRef<number>

const { data: allItems } =      toRefs(api.service('items').findInStore(computed(() => ({ query: { $limit: countItems.value } }))))
const { data: allBaseItems } =  toRefs(api.service('base-items').findInStore(computed(() => ({ query: { $limit: countBaseItems.value } }))))
const { data: allSizes } =      toRefs(api.service('sizes').findInStore(computed(() => ({ query: { $limit: countSizes.value } }))))
const { data: allFlavours } =   toRefs(api.service('flavours').findInStore(computed(() => ({ query: { $limit: countFlavours.value } }))))
const { data: allTempOrderedItems } = toRefs(api.service('ordered-items').findInStore(computed(() => ({ query: { __isTemp: true, $limit: countTempOrderedItems.value }, temps: true }))))

const rawPrice = computed(() => {
    return allTempOrderedItems.value.reduce((acc, val) => {
        let item = allItems.value.find(({ id }) => id === val.itemId)
        if (!item) {
            return acc
        }
        return acc + item.price! * val.quantity!
    }, 0)
})
const roundedSum = computed(() => {
    return Math.floor(rawPrice.value * 100) / 100
})

const populatedOrderedItems = computed(() => {
    return allTempOrderedItems.value.map(orderedItem => {
        let item = allItems.value.find(({ id }) => id === orderedItem.itemId)
        let size = allSizes.value.find(({ id }) => id === item?.sizeId)
        let flavour = allFlavours.value.find(({ id }) => id === item?.flavourId)
        let baseItem = allBaseItems.value.find(({ id }) => id === item?.baseItemId)
        return {
            orderedItem,
            item,
            size,
            flavour,
            baseItem
        }
    })
})

const closeDialog = function () {
    model.value = false
}
const decrementAtIndex = function (index: number) {
    let orderedItem = allTempOrderedItems.value[index]
    orderedItem.quantity! -= 1
    if (orderedItem.quantity! <= 0) {
        orderedItem.removeFromStore()
    }
}
const incrementAtIndex = function (index: number) {
    let orderedItem = allTempOrderedItems.value[index]
    orderedItem.quantity! += 1
}

const cash = async function () {
  await sendOrder('station', calculator.immediatelyFinishedMode)
  closeDialog()
}
</script>