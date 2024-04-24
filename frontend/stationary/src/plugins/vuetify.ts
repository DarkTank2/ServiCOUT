/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { VFab } from 'vuetify/labs/VFab'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VTimePicker,
    VFab,
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
      },
    },
  },
  defaults: {
    VAlert: {
      variant: 'outlined'
    },
    VTooltip: {
      maxWidth: 500
    }
  }
})
