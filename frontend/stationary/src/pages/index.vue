<template>
  <HelloWorld />
</template>

<script lang="ts" setup>
definePage({
  redirect: _to => {
    return { name: '/main' }
  }
})
</script>
