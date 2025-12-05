/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'system',
  },
  aliases: {
    PrimaryButton: VBtn,
    SecondaryButton: VBtn
  },
  defaults: {
    VTextField: {
      variant: 'outlined',
      hideDetails: true
    },
    VSelect: {
      variant: 'outlined',
      hideDetails: true
    },
    VSwitch: {
      hideDetails: true
    },
    VTooltip: {
      maxWidth: 500
    },
    PrimaryButton: {
      variant: 'outlined',
      color: 'primary'
    },
    SecondaryButton: {
      variant: 'solo',
      color: 'primary'
    }
  }
})
