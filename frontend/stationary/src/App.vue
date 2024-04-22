<template>
  <v-app>
    <v-app-bar id="_appbar">
      <template v-slot:prepend>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </template>
      <v-toolbar-title>{{ tenant?.currentEventName || 'Loading...' }}</v-toolbar-title>
      <v-spacer v-if="meta.appBarComponent"></v-spacer>
      <component v-if="meta.appBarComponent" :is="meta.appBarComponent" :style="{ width: '500px' }" />
      <v-spacer v-if="meta.appBarComponent"></v-spacer>
      <component v-if="meta.appBarAppendix" :is="meta.appBarAppendix" />
      <template v-if="meta.extension" #extension>
        <component :is="meta.extension" />
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list density="compact" lines="three">
        <v-list-item title="ServiCOUT" subtitle="Verfügbare stationäre Apps"></v-list-item>
        <v-divider></v-divider>
        <v-list-item :to="{ name: 'Main' }" title="Zubereitung" subtitle="Bearbeiten von Bestellungen" prepend-icon="mdi-apps"></v-list-item>
        <v-list-item :to="{ name: 'Calculator' }" title="Rechner" subtitle="Aufnahme von Bestellungen vor Ort" prepend-icon="mdi-calculator-variant-outline"></v-list-item>
        <v-list-item :to="{ name: 'Subscriptions' }" title="Abonnements" subtitle="Einstellung, welche Produkte angezeigt werden" prepend-icon="mdi-tag-check-outline"></v-list-item>
        <v-list-item :to="{ name: 'ItemManager' }" title="Item-Manager" subtitle="Deaktivieren von leeren Produkten" prepend-icon="mdi-tag-off-outline"></v-list-item>
        <v-list-item :to="{ name: 'Statistics' }" title="Statistiken" subtitle="Zeitlicher Verlauf von einem oder mehreren Produkten" prepend-icon="mdi-chart-line"></v-list-item>
        <v-list-item :to="{ name: 'base' }" title="Verlauf" subtitle="Verlauf von verkauften Produkten dieser Station" prepend-icon="mdi-history"></v-list-item>
        <v-list-item :to="{ name: 'base' }" title="Tastenkombinationen" subtitle="Hinzufügen eines Produktes mittels Tastendruck konfigurieren" prepend-icon="mdi-keyboard-outline"></v-list-item>
        <v-list-item :to="{ name: 'GlobalConfig' }" title="Konfiguration" subtitle="Nur für Administratoren!" prepend-icon="mdi-cog"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view v-slot="{ Component, route }" v-if="authStore.isAuthenticated">
        <transition :name="route.meta.transition" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
      <loading />
      <notification />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import Notification from './components/Utilities/Notification.vue';
import Loading from './components/Utilities/Loading.vue';
import ConfigurationMenu from './components/Calculator/ConfigurationMenu.vue';

const drawer = ref(false)

const authStore = useAuthStore()

const { api } = useFeathers()

// onMounted(async () => {
//   let res = await authStore.authenticate({ strategy: 'local', email: 'email', password: 'password' })
//   console.log(res)
//   api.service('tenants').find({ query: { id: 2 } })
// })

const route = useRoute()
const meta = computed(() => {
  return route.meta
})
const tenant = api.service('tenants').getFromStore(ref(2))
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
