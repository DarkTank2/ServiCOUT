<template>
  <HelloWorld />
</template>

<script lang="ts" setup>
definePage({
    meta: {
        requiresAuth: 'user'
    },
    redirect: (_to) => {
      const settings = useSettings()
      if (!settings.onboarded) {
        return '/onboarding'
      }
      if (!settings.name) {
        return '/name-input'
      }
      return '/home'
    }
})
</script>
