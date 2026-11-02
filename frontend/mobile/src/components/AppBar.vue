<template>
    <v-app-bar app :title="auth.user?.tenant?.currentEventName || 'ServiCOUT'">
        <template #extension v-if="showExtension">
            <router-view name="AppBarExtension" />
        </template>
    </v-app-bar>
</template>
<script setup lang="ts">
const auth = useAuthStore()
const router = useRouter()

const showExtension = computed(() => {
    // extension should be shown either on order-routes or cash-routes
    return router.currentRoute.value.matched.some(rlm => {
        return ['/order', '/cash/:tableId'].includes(rlm.path)
    })
})
</script>