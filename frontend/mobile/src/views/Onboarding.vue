<template>
    <v-container>
        <v-carousel v-model="model" :height="maxHeight" :continuous="false">
            <v-carousel-item>
                <v-sheet height="100%">
                    <v-card class="d-flex align-center flex-column mb-6 px-14" height="100%" flat tile>
                        <span class="mt-auto font-weight-black">HI</span>
                        <span>Danke, dass du heute Abend mithilfst.</span>
                        <span class="mb-auto">Ich erkläre dir kurz, wie du Gästen ein Lächeln ins Gesicht zaubern
                            kannst.</span>
                    </v-card>
                </v-sheet>
            </v-carousel-item>
            <v-carousel-item>
                <v-sheet height="100%">
                    <v-card class="d-flex align-center flex-column mb-6 px-14" height="100%" flat tile>
                        <span class="mt-auto font-weight-black">Die Bestellung</span>
                        <object data="undraw_online_groceries_a02y.svg" width="100%"></object>
                        <span>Mit deinem Gerät nimmst du Bestellungen bei Gästen auf.</span>
                        <span class="mb-auto">Du findest alle Items auf der Liste am Tisch, sowie später in dieser
                            App.</span>
                    </v-card>
                </v-sheet>
            </v-carousel-item>
            <v-carousel-item>
                <v-sheet height="100%">
                    <v-card class="d-flex align-center flex-column mb-6 px-14" height="100%" flat tile>
                        <span class="mt-auto font-weight-black">Das Buffet</span>
                        <object data="undraw_cooking_re_g99p.svg" width="100%"></object>
                        <span>Beim Buffet wird dann deine Bestellung von den Buffet-Meistern zusammengestellt.</span>
                        <span class="mb-auto">Jede Bestellung wird auf einem eigenen Tablett fertiggestellt und mit der
                            zugehörigen Tischnummer versehen.</span>
                    </v-card>
                </v-sheet>
            </v-carousel-item>
            <v-carousel-item>
                <v-sheet height="100%">
                    <v-card class="d-flex align-center flex-column mb-6 px-14" height="100%" flat tile>
                        <span class="mt-auto font-weight-black">Das Ausliefern</span>
                        <object data="undraw_delivery_truck_vt6p.svg" width="100%"></object>
                        <span>Sobald Bestellungen fertig sind, können diese auf den gekennzeichneten Tisch ausgetragen
                            werden.</span>
                        <span class="mb-auto">Dabei kann jeder Kellner jeden Tisch beliefern.</span>
                    </v-card>
                </v-sheet>
            </v-carousel-item>
            <v-carousel-item>
                <v-sheet height="100%">
                    <v-card class="d-flex align-center flex-column mb-6 px-14" height="100%" flat tile>
                        <span class="mt-auto font-weight-black">Das Kassieren</span>
                        <object data="undraw_bitcoin_p2p_re_1xqa.svg" width="100%"></object>
                        <span>Nachdem die Gäste ihre Bestellung erhalten haben, müssen sie gleich bezahlen.</span>
                        <span>Das läuft wieder über dein Gerät ab.</span>
                        <span class="mb-auto">Dabei kann alles auf einmal oder individuell bezahlt werden.</span>
                    </v-card>
                </v-sheet>
            </v-carousel-item>
            <v-carousel-item>
                <v-sheet height="100%">
                    <v-card class="d-flex align-center flex-column mb-6 px-14" height="100%" flat tile>
                        <span class="mt-auto font-weight-black"> </span>
                        <span>Du wirst in drei Sekunden zur Applikation weitergeleitet!</span>
                        <span>Sollte dies nicht der Fall sein, drücke bitte auf folgenden Button.</span>
                        <v-btn @click="redirect" color="primary">Zur App</v-btn>
                        <span class="mb-auto"> </span>
                    </v-card>
                </v-sheet>
            </v-carousel-item>
        </v-carousel>
    </v-container>
</template>
<script setup lang="ts">
    const usersettings = useUsersettings()
    const router = useRouter()

    const model = ref(0)

    const maxHeight = computed(() => {
        return window.innerHeight - 56 - 2*12
    })

    const redirect = function () {
        usersettings.finalizeOnboarding()
        setTimeout(() => { router.push({ name: 'Home' }) }, 3000)
    }

    watch(model, (newModel: number) => {
        if (newModel === 5) {
            redirect()
        }
    })
</script>
<style scoped>
span {
  text-align: center;
}
</style>