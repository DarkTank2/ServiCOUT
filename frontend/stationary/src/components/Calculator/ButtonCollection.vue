<template>
    <div class="d-flex justify-space-around" style="width: 100%;">
    <v-btn outlined @click="openShoppingCart">
      <v-icon>mdi-cart-outline</v-icon>
      <span class="ml-2">Bestellung ansehen</span>
    </v-btn>
    <v-btn outlined @click="sendOrder('station', calculator.immediatelyFinishedMode)">
      <v-icon>mdi-currency-eur</v-icon>
      <span class="ml-2">Bestellung kassieren</span>
    </v-btn>
    <v-btn outlined @click="clearOrder">
      <v-icon>mdi-close</v-icon>
      <span class="ml-2">Zurücksetzen</span>
    </v-btn>
    <OrderDialog />
  </div>
</template>
<script setup lang="ts">
import OrderDialog from './OrderDialog.vue';
const { api } = useFeathers()
const { openShoppingCart } = useCalculatorStore()
const { sendOrder } = useUtilityStore()
const calculator = useCalculatorStore()
const clearOrder = function () {
  let { data } = api.service('ordered-items').findInStore({ query: { __isTemp: true }, temps: true })
  data.forEach(entry => {
    entry.removeFromStore()
  })
}
</script>