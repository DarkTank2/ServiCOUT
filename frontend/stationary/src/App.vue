<template>
  <v-app>
    <v-app-bar app id="_appbar">
      <v-toolbar-title>{{ tenant?.currentEventName || 'Loading...' }}</v-toolbar-title>
    </v-app-bar>
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

const authStore = useAuthStore()

const { api } = useFeathers()

const fetch = function () {
  api.service('tenants').find({ query: { id: 2 } })
  api.service('tables').find({ query: { $limit: 100 } })
  fetchBaseItems(0)
  fetchSizes(0)
  // api.service('options').find()
  fetchFlavours(0)
  fetchItems(0)
}
onMounted(async () => {
  let res = await authStore.authenticate({ strategy: 'local', email: 'email', password: 'password' })
  console.log(res)
  fetch()
})

const route = useRoute()
const meta = computed(() => {
  return route.meta
})
const tenant = api.service('tenants').getFromStore(ref(2))

const fetchSizes = function (_skip: number) {
  api.service('sizes').find({ query: { $skip: _skip } }).then(({ data, skip, total }) => {
    if (data.length === 0) {
      // empty data, thu no data istransferred and there is no more data
      return
    }
    if (data.length + skip !== total) {
      fetchSizes(data.length + skip)
    }
  })
}
const fetchFlavours = function (_skip: number) {
  api.service('flavours').find({ query: { $skip: _skip } }).then(({ data, total, skip }) => {
    if (data.length === 0) {
      // empty data, thu no data istransferred and there is no more data
      return
    }
    if (data.length + skip !== total) {
      fetchFlavours(data.length + skip)
    }
  })
}
const fetchBaseItems = function (_skip: number) {
  api.service('base-items').find({ query: { $skip: _skip } }).then(({ data, total, skip }) => {
    if (data.length === 0) {
      // empty data, thu no data istransferred and there is no more data
      return
    }
    if (data.length + skip !== total) {
      fetchBaseItems(data.length + skip)
    }
  })
}
const fetchItems = function (_skip: number) {
  api.service('items').find({ query: { $skip: _skip } }).then(({ data, total, skip }) => {
    if (data.length === 0) {
      // empty data, thu no data istransferred and there is no more data
      return
    }
    if (data.length + skip !== total) {
      fetchItems(data.length + skip)
    }
  })
}
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
