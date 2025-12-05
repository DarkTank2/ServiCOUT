<template>
    <v-list-item :to="props.to">
        <template #prepend class="ma-auto">
            <v-avatar>
                <v-icon :icon="props.icon"></v-icon>
            </v-avatar>
        </template>
        <v-list-item-title>{{ props.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ props.subtitle }}</v-list-item-subtitle>
    </v-list-item>
</template>
<script setup lang="ts">
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

export interface NavigationListItemProps {
    title: string,
    subtitle: string,
    to: RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric,
    icon: string
}
const props = defineProps<NavigationListItemProps>()
</script>