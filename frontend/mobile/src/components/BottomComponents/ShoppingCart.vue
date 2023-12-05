<template>
    <v-card class="text-center" height="200">
        <v-card-text>
            <div>
                This is a bottom sheet using the controlled by v-model instead of activator
            </div>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
const emit = defineEmits<{
    closeBottomComponent: []
}>()
</script>