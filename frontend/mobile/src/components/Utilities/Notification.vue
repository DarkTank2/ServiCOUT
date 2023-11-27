<template>
    <!-- <v-snackbar
        :value="notification"
        timeout="-1"
        rounded="lg"
        >
        <div style="margin-left:20px;">
            <span v-if="notification" v-text="notification.message" :class="colorClass"></span>
        </div>
        <template v-slot:action="{ attrs }">
          <v-progress-circular :value="progress" color="primary" size="40" width="3" class="no-transition">
            <v-btn
                color="red"
                icon
                v-bind="attrs"
                @click="closeNotification"
                >
                <v-icon>close</v-icon>
            </v-btn>
          </v-progress-circular>
        </template>
    </v-snackbar> -->
    <div>test</div>
</template>
<script setup lang="ts">
// const timer = ref
</script>

<!-- <script>
import { mapActions, mapState } from 'vuex'
export default {
    data: () => ({
        timer: null,
        progressTimer: null,
        progressDecrement: 0,
        progress: 0,
        progressTimeoutMS: 50
    }),
    created: function () {},
    methods: {
        ...mapActions('utilities', {
            resetNotification: 'resetNotification'
        }),
        closeNotification: function () {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            if (this.progressTimer) {
              clearTimeout(this.progressTimer)
            }
            this.timer = null
            this.progressTimer = null
            this.progress = 0
            setTimeout(() => { this.resetNotification() }, 50)
        },
        makeSingleDecrement: function () {
          this.progress -= this.progressDecrement
          if (this.progress <= 0) {
            this.progressTimer = null
            return
          }
          this.progressTimer = setTimeout(this.makeSingleDecrement, this.progressTimeoutMS)
        }
    },
    computed: {
        ...mapState('utilities', {
            notification: 'notification'
        }),
        icon: function () {
            let icons = {
                'success': 'check',
                'error': 'warning'
            }
            return this.notification.icon || icons[this.notification.type] || 'warning'
        },
        colorClass: function () {
            let colors = {
                'success': 'green--text text--lighten-1',
                'error': 'red--text text--lighten-1'
            }
            return this.notification?.colorClass || colors[this.notification?.type] || 'orange--text text-lighten-1'
        }
    },
    watch: {
        notification: {
            handler: function (newNotification) {
                if (newNotification) {
                    if (this.timer) {
                        clearTimeout(this.timer)
                    }
                    if (this.progressTimer) {
                      clearTimeout(this.progressTimer)
                    }
                    this.progressDecrement = 0
                    this.progress = 0
                    if (newNotification.timeout > 0) {
                      this.progress = 100
                      this.progressDecrement = 100 / newNotification.timeout // increment per millisecond
                      this.progressDecrement = this.progressDecrement * this.progressTimeoutMS * 1.15 // make an increment ever thenth of a second
                      this.progressTimer = setTimeout(this.makeSingleDecrement, this.progressTimeoutMS)
                      this.timer = setTimeout(this.closeNotification, newNotification.timeout)
                    }
                }
            },
            immediate: true
        }
    }
}
</script> -->

<style>

.no-transition .v-progress-circular__overlay {
  transition: all 0.01s ease-in-out;
}

</style>