<template>
  <v-app>
    <v-app-bar app id="_appbar">
      <template v-if="meta.titleReplacement">
        <component :is="meta.titleReplacement" />
      </template>
      <v-toolbar-title v-else>{{ tenant.length > 0 ? tenant[0].currentEventName : 'Loading...' }}</v-toolbar-title>
      <v-spacer v-if="meta.appBarComponent"></v-spacer>
      <component v-if="meta.appBarComponent" :is="meta.appBarComponent" />
      <v-spacer v-if="meta.appBarComponent"></v-spacer>
      <template v-slot:extension v-if="meta.extension">
        <component :is="meta.extension" />
      </template>
    </v-app-bar>
    <v-bottom-sheet
      v-model="bottomComponentModel"
      v-if="meta.bottomComponent"
      >
      <component :is="meta.bottomComponent" @closeBottomComponent="bottomComponentModel = false" />
    </v-bottom-sheet>
    <v-main>
      <router-view/>
      <v-btn
            v-if="meta.bottomComponent"
            elevation="2"
            position="fixed"
            style="bottom: 66px !important; right: 10px !important;"
            class="text-none"
            icon
            @click="bottomComponentModel = true"
            >
            <v-badge
              bordered
              :content="badgeContent"
              :model-value="badgeContent ? true : false"
              :color="badgeColor"
              offset-y="-8"
              offset-x="-2"
              >
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
      <v-btn :to="{ name: 'Order' }">
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
  authStore.authenticate({ strategy: 'local', email: 'x.s@gmx.at', password: '1234' })
  const { api } = useFeathers()
  onMounted(async () => {
    await api.service('tenants').find({ query: {} })
    api.service('base-items').find()
    api.service('sizes').find()
    api.service('options').find()
    api.service('flavours').find()
    api.service('items').find()
  })
    
  const route = useRoute()
  const meta = computed(() => {
    return route.meta
  })
  const mainStyle = computed(() => {
    return `padding: ${meta.value.extension ? '104' : '56'}px 0px 0px;`
  })
  const tenantQuery = computed(() => {
    return { query: { id: 2 } }
  })
  const { data: tenant } = toRefs(api.service('tenants').findInStore(tenantQuery))
  let rawOrderQuery = computed(() => {
    return { query: { __isTemp: true }, temps: true }
  })
  const { data: rawOrder } = toRefs(api.service('ordered-items').findInStore(rawOrderQuery))
  const allCartItemsAvailable = computed(() => {
    let flag = true
    rawOrder.value.forEach(orderedItem => {
      let item = api.service('items').findInStore({ query: { id: orderedItem.itemId! } }).data[0]
      let baseItem = api.service('base-items').findInStore({ query: { id: item.baseItemId! } }).data[0]
      flag &&= baseItem.available!
    })
    return flag
  })
    

  const badgeContent = computed(() => {
    return allCartItemsAvailable.value ? rawOrder.value.reduce((acc, val) => acc + val.quantity!, 0) : '!'
  })
  const badgeColor = computed(() => {
    return allCartItemsAvailable.value ? 'green' : 'error'
  })
</script>
