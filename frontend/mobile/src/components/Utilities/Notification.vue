<template>
    <v-snackbar
        v-model="notification"
        :timeout="utilities.getNotification.timeout"
        rounded="lg"
        >
        <v-progress-linear v-model="progress" absolute top :color="utilities.getNotification.type"></v-progress-linear>
        <span v-text="utilities.getNotification.message" :class="colorClass"></span>
        <template v-slot:actions>
            <v-btn
                color="red"
                icon
                @click="notification = false"
                >
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</template>
<script setup lang="ts">
const progressTimer = ref<NodeJS.Timeout | null>(null)
const progressDecrement = ref(0)
const progress = ref(100)
const progressTimeoutMS = ref(50)
const notification = ref(false)

let utilities = useUtilityStore()

const makeSingleDecrement = function () {
    progress.value -= progressDecrement.value
    if (progress.value <= 0) {
        progress.value = 0
        progressTimer.value = null
        notification.value = false
        return
    }
    progressTimer.value = setTimeout(makeSingleDecrement, progressTimeoutMS.value)
}

const icon = computed(() => {
    if (!utilities.getNotification) {
        return null
    } else {
        let icons = {
            'success': 'check',
            'error': 'warning'
        }
        return utilities.getNotification.icon || icons[utilities.getNotification.type] || 'warning'
    }
})
const colorClass = computed(() => {
    if (!utilities.getNotification) {
        return null
    } else {
        let colors = {
            'success': 'text-green-lighten-1',
            'error': 'txt-red-lighten-1'
        }
        return utilities.getNotification.colorClass || colors[utilities.getNotification.type] || 'text-orange-lighten-1'
    }
})

watch(notification, (newValue) => {
    if (!newValue) {
        utilities.resetNotification()
        if (progressTimer.value) {
            clearTimeout(progressTimer.value)
        }
    }
})
utilities.$onAction(({ name, args }) => {
    if (name === 'setNotification') {
        notification.value = true
        if (progressTimer.value) {
            clearTimeout(progressTimer.value)
        }
        progress.value = 100
        progressDecrement.value = 100 / args[0].timeout * progressTimeoutMS.value * 1.15 // increment per millisecond
        progressTimer.value = setTimeout(makeSingleDecrement, progressTimeoutMS.value)
    }
})
</script>

<style>
</style>