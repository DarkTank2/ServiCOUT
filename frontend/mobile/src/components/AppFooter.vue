<template>
  <v-bottom-navigation grow mode="shift" color="primary">
    <v-btn :to="{ name: '/order' }">
      <v-icon icon="mdi-silverware"></v-icon>
      <span>Bestellen</span>
    </v-btn>
    <v-btn :to="{ name: '/cash/' }">
      <v-icon icon="mdi-cash-multiple"></v-icon>
      <span>Bezahlen</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
  
</script>
