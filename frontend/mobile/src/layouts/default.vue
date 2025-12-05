<template>
  <AppBar />

  <!-- if the padding is not added, dialogues of all kind will move the content farther down -->
  <v-main :style="{ 'padding-top': showExtension ? '112px' : '64px' }">
    <router-view />
  </v-main>

  <AppFooter />
</template>

<script lang="ts" setup>
  const router = useRouter()
    const showExtension = computed(() => {
        // extension should be shown either on order-routes or cash-routes
        return router.currentRoute.value.matched.some(rlm => {
            return ['/order', '/cash/:tableId'].includes(rlm.path)
        })
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
