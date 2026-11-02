/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders'
import { router } from '../router'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(pinia)
    .use(vuetify)
    .use(DataLoaderPlugin, { router })
    .use(router)
}
