<template>
  <v-app-bar id="_appbar">
      <template v-slot:prepend>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </template>
      <v-toolbar-title>{{ tenant?.currentEventName || 'Loading...' }}</v-toolbar-title>
      <v-spacer ></v-spacer>
      <router-view name="AppBarComponent" :style="{ width: '500px' }"/>
      <v-spacer ></v-spacer>
      <router-view name="AppBarAppendix"/>
      <template v-if="showExtension" #extension>
        <router-view name="AppBarExtension"/>
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary nav>
      <v-list density="compact" lines="three" color="primary">
        <v-list-item title="ServiCOUT" subtitle="Verfügbare stationäre Apps"></v-list-item>
        <v-divider></v-divider>
        <navigation-list-item v-for="item in navElements" :key="`nav_${item.title}`"
          :title="item.title"
          :subtitle="item.subtitle"
          :icon="item.icon"
          :to="item.to" />
      </v-list>
    </v-navigation-drawer>
  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import type { NavigationListItemProps } from '@/components/Utilities/NavigationListItem.vue'

const { api } = useFeathers()
const router = useRouter()

const drawer = ref(false)

// const route = useRoute()
// const meta = computed(() => {
//   return route.meta
// })
const tenant = api.service('tenants').getFromStore(ref(2))
const showExtension = computed(() => {
    // extension should be shown either on order-routes or cash-routes
    return router.currentRoute.value.matched.some(rlm => {
        return ['/calculator'].includes(rlm.path)
    })
})

const navElements = computed<Array<NavigationListItemProps>>(() => {
  return [
    { to: { name: '/main' }, title: "Zubereitung", subtitle: "Bearbeiten von Bestellungen", icon: "mdi-apps" },
    { to: { path: '/calculator' }, title: "Rechner", subtitle: "Aufnahme von Bestellungen vor Ort", icon: "mdi-calculator-variant-outline" },
    { to: { name: '/subscriptions' }, title: "Abonnements", subtitle: "Einstellung, welche Produkte angezeigt werden", icon: "mdi-tag-check-outline" },
    { to: { name: '/item-manager' }, title: "Item-Manager", subtitle: "Deaktivieren von leeren Produkten", icon: "mdi-tag-off-outline" },
    { to: { name: '/statistics' }, title: "Statistiken", subtitle: "Zeitlicher Verlauf von einem oder mehreren Produkten", icon: "mdi-chart-line" },
    { to: { name: '/history' }, title: "Verlauf", subtitle: "Verlauf von verkauften Produkten dieser Station", icon: "mdi-history" },
    { to: { name: '/keybindings' }, title: "Tastenkombinationen", subtitle: "Hinzufügen eines Produktes mittels Tastendruck konfigurieren", icon: "mdi-keyboard-outline" },
    { to: { name: '/config' }, title: "Konfiguration", subtitle: "Nur für Administratoren!", icon: "mdi-cog" },
    { to: { path: '/data-exchange/' }, title: 'Import-Export', subtitle: 'Datenaustausch in/aus CSV-Formaten', icon: 'mdi-database-sync' }
  ]
})
</script>
