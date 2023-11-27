<template>
  <v-card>
    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="6">
            <v-btn block :to="{ name: 'Order' }" outlined>
              <v-icon>brunch_dining</v-icon>
              <span class="ml-2">Bestellung aufnehmen</span>
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <!-- <v-btn block :to="{ name: 'TableSelection' }" outlined>
              <v-icon>euro_symbol</v-icon>
              <span class="ml-2">Kassieren</span>
            </v-btn> -->
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import HelloWorld from '@/components/HelloWorld.vue'
</script>
