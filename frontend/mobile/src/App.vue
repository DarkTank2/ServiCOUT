<template>
  <v-app>
    <v-app-bar app id="_appbar">
      <template v-if="meta.titleReplacement">
        <component :is="meta.titleReplacement" />
      </template>
      <!-- <v-toolbar-title v-else>{{ env ? env.occasion : 'Loading...' }}</v-toolbar-title> -->
      <v-spacer v-if="meta.appBarComponent"></v-spacer>
      <component v-if="meta.appBarComponent" :is="meta.appBarComponent" />
      <v-spacer v-if="meta.appBarComponent"></v-spacer>
      <template v-slot:extension v-if="meta.extension">
        <component :is="meta.extension" />
      </template>
    </v-app-bar>
    <!-- <v-navigation-drawer
      v-model="bottomNav"
      app
      temporary
      bottom
      v-if="meta.bottomNavbarComponent"
      >
      <component :is="meta.bottomNavbarComponent" @closeNavbar="bottomNav = false" />
    </v-navigation-drawer> -->
    <v-main :style="mainStyle">
      <router-view/>
      <!-- <v-btn
            v-if="meta.bottomNavbarComponent"
            elevation="2"
            fab
            fixed
            bottom
            right
            @click="bottomNav = true"
            style="bottom: 70px !important;"
            >
            <v-badge
              bordered
              :content="badgeContent"
              :value="badgeContent"
              :color="badgeColor"
              >
                <v-icon>shopping_cart</v-icon>
            </v-badge>
      </v-btn> -->
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
      <!-- <v-btn :to="{ name: 'TableSelection' }" >
        <span class="ml-2">Kassieren</span>
        <v-icon>euro_symbol</v-icon>
      </v-btn> -->
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts" setup>
  import Notification from './components/Utilities/Notification.vue';
  import Loading from './components/Utilities/Loading.vue';
  
  // const { setNotification, setFetchPending, resetFetchPending } = useUtilityStore()
  // setTimeout(() => {
  //   setNotification({ message: 'Test notification', timeout: 5000, type: 'success' })
  //   setTimeout(() => {
  //     setFetchPending()
  //   }, 6000)
  //   setTimeout(() => {
  //     resetFetchPending()
  //   }, 9000)
  // }, 1000)
  // import { onMounted } from 'vue'
  
  // const authStore = useAuthStore()
  // authStore.authenticate({ strategy: 'local', email: 'x.s@gmx.at', password: '1234' })
  // onMounted(async () => {
  //   const { api } = useFeathers()
  //   await api.service('sizes').find({ query: {} })
  //   console.log(api.service('sizes').findInStore({ query: {} }).data)
    
  // })
  const route = useRoute()
  const meta = computed(() => {
    return route.meta
  })
  const mainStyle = computed(() => {
    return `padding: ${meta.value.extension ? '104' : '56'}px 0px 0px;`
  })
</script>
