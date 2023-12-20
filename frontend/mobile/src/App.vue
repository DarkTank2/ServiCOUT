<template>
  <v-app>
    <v-app-bar app id="_appbar">
      <template v-if="meta.titleReplacement">
        <component :is="meta.titleReplacement" />
      </template>
      <v-toolbar-title v-else>{{ tenant?.currentEventName || 'Loading...' }}</v-toolbar-title>
      <v-spacer v-if="meta.appBarComponent"></v-spacer>
      <component v-if="meta.appBarComponent" :is="meta.appBarComponent" />
      <v-spacer v-if="meta.appBarComponent"></v-spacer>
      <template v-slot:extension v-if="meta.extension">
        <component :is="meta.extension" :key="`${route.path}_extension`" />
      </template>
    </v-app-bar>
    <v-bottom-sheet v-model="bottomComponentModel" v-if="meta.bottomComponent" scrollable max-height="80%">
      <component :is="meta.bottomComponent" @closeBottomComponent="bottomComponentModel = false" />
    </v-bottom-sheet>
    <v-main>
      <router-view v-slot="{ Component, route }" v-if="authStore.isInitDone">
        <transition :name="route.meta.transition" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
      <v-btn v-if="meta.bottomComponent" elevation="2" position="fixed"
        style="bottom: 66px !important; right: 10px !important; background: rgb(var(--v-theme-surface));" icon
        @click="bottomComponentModel = true" variant="outlined">
        <v-badge bordered :content="badgeContent" :model-value="badgeContent ? true : false" :color="badgeColor"
          offset-y="-8" offset-x="-2">
          <v-icon>mdi-cart-outline</v-icon>
        </v-badge>
      </v-btn>
      <loading />
      <notification />
    </v-main>
    <v-bottom-navigation color="primary" fixed grow v-if="$route.name !== 'Onboarding'">
      <v-btn :to="{ name: 'Order' }">
        <v-icon>mdi-silverware</v-icon>

        <span>Bestellen</span>
      </v-btn>
      <v-btn :to="{ name: 'Cash/AllTables' }">
        <v-icon>mdi-cash-multiple</v-icon>

        <span>Kassieren</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts" setup>
import Notification from './components/Utilities/Notification.vue';
import Loading from './components/Utilities/Loading.vue';

const bottomComponentModel = ref(false)

const authStore = useAuthStore()
authStore.authenticate({ strategy: 'local', email: 'email', password: 'password' })
const { api } = useFeathers()
const interval = setInterval(() => {
  api.service('tenants').find({ query: { id: 2 } })
  api.service('tables').find()
  api.service('base-items').find()
  api.service('sizes').find()
  api.service('options').find()
  api.service('flavours').find()
  api.service('items').find()
}, 3000)
onBeforeUnmount(() => {
  clearInterval(interval)
})

const route = useRoute()
const meta = computed(() => {
  return route.meta
})
const tenant = api.service('tenants').getFromStore(ref(2))
let rawOrderQuery = computed(() => {
  return { query: { __isTemp: true }, temps: true }
})
const { data: rawOrder } = toRefs(api.service('ordered-items').findInStore(rawOrderQuery))
const allCartItemsAvailable = computed(() => {
  return rawOrder.value.every(orderedItem => {
    let item = api.service('items').findInStore({ query: { id: orderedItem.itemId! } }).data[0]
    let baseItem = api.service('base-items').findInStore({ query: { id: item.baseItemId! } }).data[0]
    return baseItem.available
  })
})


const badgeContent = computed(() => {
  return allCartItemsAvailable.value ? rawOrder.value.reduce((acc, val) => acc + val.quantity!, 0) : '!'
})
const badgeColor = computed(() => {
  return allCartItemsAvailable.value ? 'green' : 'error'
})
</script>
<style>
.swipe-right-enter-active {
  transition: all 0.5s ease-out;
}

.swipe-right-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.swipe-right-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.swipe-right-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.swipe-left-enter-active {
  transition: all 0.5s ease-out;
}

.swipe-left-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.swipe-left-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.swipe-left-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
