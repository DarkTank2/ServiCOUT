<template>
    <v-card variant="outlined" @click="usersettings.updateSubscriptions(props.id)" :style="{ borderColor }">
        <v-card-text>
            <span>{{ baseItem.name }}</span>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
const { api } = useFeathers()
const usersettings = useUsersettings()
interface BaseItemProps {
    id: number
}
const props = defineProps<BaseItemProps>()
const baseItem = api.service('base-items').getFromStore(props.id)
const borderColor = computed(() => {
    return usersettings.getSubscriptions.includes(props.id) ? '#2196f3' : 'currentColor'
})
</script>