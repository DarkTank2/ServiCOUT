<template>
    <v-container>
        <v-carousel v-model="model" :height="maxHeight" :continuous="false">
            <v-carousel-item>
                <v-sheet height="100%">
                    <v-card class="d-flex align-center flex-column mb-6 px-14" height="100%" flat tile>
                        <span class="mt-auto font-weight-black">Hallo</span>
                        <span>Ich brauche ein paar Informationen von dir, damit ich dich an die richtige Stelle leiten
                            kann!</span>
                        <div class="mb-auto">
                            <v-btn color="primary" @click="model++">Hier gehts
                                weiter.</v-btn>
                        </div>
                    </v-card>
                </v-sheet>
            </v-carousel-item>
            <v-carousel-item>
                <v-sheet height="100%">
                    <v-card class="d-flex align-center flex-column mb-6 px-14" height="100%" flat tile>
                        <span class="mt-auto font-weight-black">Deine Rolle</span>
                        <span>Welche Art von Station stellst du dar?</span>
                        <span>Bei einer <span class="font-weight-bold">Basisstation</span> werden z.B Speisen und Getränke hergerichtet und
                            zusammengestellt.</span>
                        <span>Bei der <span class="font-weight-bold">Verrechnung</span> werden Bestellungen aufgenommen
                            und verrechnet.</span>
                        <div class="mb-auto">
                            <v-row justify="space-around">
                                <v-col cols="6"><v-btn color="primary"
                                        @click="setBuffet"><v-icon icon="mdi-apps"></v-icon>Basisstation</v-btn></v-col>
                                <v-col cols="6"><v-btn color="primary"
                                        @click="setCalculator"><v-icon icon="mdi-calculator-variant-outline"></v-icon>Verrechnung</v-btn></v-col>
                            </v-row>
                        </div>
                    </v-card>
                </v-sheet>
            </v-carousel-item>
            <v-carousel-item>
                <v-sheet height="100%">
                    <v-card class="d-flex align-center flex-column mb-6 px-14" height="100%" flat tile>
                        <span class="mt-auto font-weight-black">Die Verrechnung</span>
                        <span>Als nächstes muss ich wissen, ob deine Bestellungen direkt abgeschlossen werden, oder
                            nicht.</span>
                        <span>Beantworte dazu einfach folgende Frage:</span>
                        <span>Wenn jemand eine Bestellung bei dir aufgibt, können die bestellten Sachen auch sofort
                            mitgenommen werden,
                            </span><span>oder müssen sie erst hergerichtet/zubereitet werden?</span>
                        <span>Hinweis: Die Zubereitung bzw. das Herrichten wird an einer Basisstation durchgeführt.</span>
                        <div class="mb-auto">
                            <v-row>
                                <v-col cols="6"><v-btn block color="primary" @click="setImmediatelyFinished">Sofort
                                        fertig</v-btn></v-col>
                                <v-col cols="6"><v-btn block color="primary" @click="setPreparation">
                                        Herrichten</v-btn></v-col>
                            </v-row>
                        </div>
                    </v-card>
                </v-sheet>
            </v-carousel-item>
            <v-carousel-item>
                <v-sheet height="100%">
                    <v-card class="d-flex align-center flex-column mb-6 px-14" height="100%" flat tile>
                        <span class="mt-auto font-weight-black">Dein Stationsname</span>
                        <span>Zu guter letzt brauche ich noch den Namen deiner Station.</span>
                        <span>Am besten ist, wenn dieser Name eindeutig deine Station repräsentiert.</span>
                        <span>Beispiele sind: Buffet, Getränkestation_1, Merch_1</span>
                        <div class="mb-auto mt-2">
                            <v-row dense>
                                <v-col cols="12"><v-text-field v-model="stationName" variant="outlined" hide-details
                                        label="Stationsname" @update:model-value="usersettings.setName"></v-text-field></v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12"><v-btn block color="primary"
                                        :disabled="stationName === null || stationName === ''" @click="model++">Hier
                                        gehts weiter.</v-btn></v-col>
                            </v-row>
                        </div>
                    </v-card>
                </v-sheet>
            </v-carousel-item>
            <v-carousel-item>
                <v-sheet height="100%">
                    <v-card class="d-flex align-center flex-column mb-6 px-14" height="100%" flat tile>
                        <span class="mt-auto font-weight-black">Zum Abschluss noch</span>
                        <span>Vielen Dank für die Infos.</span>
                        <span>Damit kann ich jetzt die App bestmöglich für dich vorbereiten und aufsetzen.</span>
                        <div class="mb-auto">
                            <v-row>
                                <v-col cols="12"><v-btn block color="primary" @click="model++">Hier gehts
                                        weiter.</v-btn></v-col>
                            </v-row>
                        </div>
                    </v-card>
                </v-sheet>
            </v-carousel-item>
            <v-carousel-item>
                <v-sheet height="100%">
                    <v-card class="d-flex align-center flex-column mb-6 px-14" height="100%" flat tile>
                        <span class="mt-auto font-weight-black"> </span>
                        <span>Du wirst gleich zu den Abonnments weitergeleitet!</span>
                        <span>Überprüfe dort bitte, ob alle dich betreffenden Produkte ausgewählt sind!</span>
                        <span>Danach kannst du zu deiner personalisierten Applikation weiter navigieren.</span>
                        <span class="mb-auto"> </span>
                    </v-card>
                </v-sheet>
            </v-carousel-item>
        </v-carousel>
    </v-container>
</template>
<script setup lang="ts">
import router from '@/router';

const utilities = useUtilityStore()
const usersettings = useUsersettings()
const calculator = useCalculatorStore()

const model = ref<number>(0)
const target = ref<string>('Main')
const stationName = ref<string>(usersettings.getName || '')

const maxHeight = computed(() => {
    return window.innerHeight - 56 - 2 * 12
})

const setBuffet = function () {
    target.value = 'Subscriptions'
    utilities.setStoredRoute({ name: 'Main' })
    model.value = 5
}
const setCalculator = function () {
    target.value = 'Subscriptions'
    utilities.setStoredRoute({ name: 'Calculator' })
    model.value++
}
const setImmediatelyFinished = function () {
    calculator.updateImmediatelyFinishedMode(true)
    model.value++
}
const setPreparation = function () {
    calculator.updateImmediatelyFinishedMode(false)
    model.value++
}
const redirect = function () {
    setTimeout(() => { router.push({ name: target.value }) }, 3000)
}
watch(model, (newVal) => {
    if (newVal === 5) {
        usersettings.finalizeOnboarding()
        redirect()
    }
})
</script>