<template>
  <AppBar />

  <!-- if the padding is not added, dialogues of all kind will move the content farther down -->
  <v-main style="padding-top: 64px;">
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
  //
</script>
