<template>
  <v-container fluid height="100%" class="pb-0">
    <v-row align="center" style="height: 50%;">
      <v-col cols="12" sm="6">
        <v-btn block :to="{ name: '/order' }" variant="outlined">
          <v-icon>mdi-silverware</v-icon>
          <span class="ml-2">Bestellung aufnehmen</span>
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn block :to="{ name: '/cash/' }"  variant="outlined">
          <v-icon>mdi-cash-multiple</v-icon>
          <span class="ml-2">Kassieren</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row align="end" justify="center" style="height: 50%;">
      <v-col cols="5"  class="pb-0">
        <v-card height="90%" style="background: transparent;" class="rounded border">
          <template #text>
            <p class="text-center text-body-1">Hier kannst du Bestellungen aufnehmen</p>
          </template>
          <template #actions>
            <v-row justify="center">
              <v-icon icon="mdi-chevron-down" class="bouncy"></v-icon>
            </v-row>
          </template>
        </v-card>
      </v-col>
      <v-col cols="5"  class="pb-0">
        <v-card height="90%" style="background: transparent;" class="rounded border">
          <template #text>
            <p class="text-center text-body-1">Hier kannst du Produkte kassieren</p>
          </template>
          <template #actions>
            <v-row justify="center">
              <v-icon icon="mdi-chevron-down" class="bouncy"></v-icon>
            </v-row>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
definePage({
  meta: {
    requiresAuth: 'user'
  }
})
</script>
<style lang="css" scoped>
@keyframes bounce {
  0%, 10%,90%, 100% {
    transform: translateY(0);
    opacity: 1;
  }
	25%, 75% {
    transform: translateY(-15px);
  }
	50% {
    transform: translateY(10px);
  }
}
.bouncy {
  animation: bounce 2s infinite 2s;
}
</style>
